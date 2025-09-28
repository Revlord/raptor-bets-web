'use client';

type Point = { t: number; value: number }; // value in [-1,1]

export default function MomentumSparkline({ data, width = 380, height = 70 }:{
  data: Point[]; width?: number; height?: number;
}) {
  if (!data?.length) {
    return <div className="h-[70px] rounded-xl bg-black/40 grid place-items-center text-xs text-white/50">
      momentum incoming…
    </div>;
  }
  const pad = 8;
  const t0 = data[0].t, t1 = data[data.length - 1].t || 1;
  const x = (t: number) => pad + ((t - t0) / Math.max(1, t1 - t0)) * (width - 2*pad);
  const y = (v: number) => height/2 - v * (height/2 - pad);

  let d = `M ${x(data[0].t)} ${y(data[0].value)}`;
  for (let i = 1; i < data.length; i++) d += ` L ${x(data[i].t)} ${y(data[i].value)}`;

  // area to zero for nice river look
  let a = `M ${x(data[0].t)} ${height/2}`;
  for (let i = 0; i < data.length; i++) a += ` L ${x(data[i].t)} ${y(data[i].value)}`;
  a += ` L ${x(data[data.length - 1].t)} ${height/2} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="white" stopOpacity="0.05"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={width} height={height} rx="12" fill="rgba(0,0,0,0.65)" />
      <line x1="0" x2={width} y1={height/2} y2={height/2} stroke="rgba(255,255,255,0.2)" />
      <path d={a} fill="url(#g)" />
      <path d={d} stroke="white" strokeWidth="2" fill="none" />
    </svg>
  );
}
