'use client';

export default function StatusBar({ wsStatus }:{ wsStatus: 'closed'|'connecting'|'open'|'error' }) {
  const color =
    wsStatus === 'open' ? 'bg-emerald-500' :
    wsStatus === 'connecting' ? 'bg-amber-400' :
    wsStatus === 'error' ? 'bg-rose-500' : 'bg-neutral-500';
  return (
    <div className="text-xs text-neutral-400 flex items-center gap-2">
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />
      WS: {wsStatus}
    </div>
  );
}
