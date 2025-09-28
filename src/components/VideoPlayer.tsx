'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  src: string;
  onTick?: (t: number, playing: boolean) => void;
  onMark?: (label: string, t: number) => void;
  className?: string;
};

export default function VideoPlayer({ src, onTick, onMark, className }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const beat = useRef<number>(0);
  const [marks, setMarks] = useState<{ t: number; label: string }[]>([]);

  // heartbeats
  useEffect(() => {
    if (!onTick) return;
    if (!playing) return;
    const id = setInterval(() => {
      const t = ref.current?.currentTime ?? 0;
      const now = Date.now();
      if (now - beat.current > 950) {
        beat.current = now;
        onTick(+t.toFixed(3), true);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [playing, onTick]);

  // send pause beat
  const onPause = () => {
    setPlaying(false);
    const t = ref.current?.currentTime ?? 0;
    onTick?.(+t.toFixed(3), false);
  };

  // hotkeys
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = ref.current?.currentTime ?? 0;
      const label =
        e.key === '1' ? 'SHOT' :
        e.key === '2' ? 'FOUL' :
        e.key === '3' ? 'REBOUND' :
        e.key.toLowerCase() === 'm' ? 'CUSTOM' : null;
      if (!label) return;
      onMark?.(label, +t.toFixed(3));
      setMarks(m => [...m, { t: +t.toFixed(3), label }].slice(-50));
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onMark]);

  // compute % for markers
  const percent = (t: number) => {
    const d = ref.current?.duration ?? 0;
    return d ? Math.min(100, Math.max(0, (t / d) * 100)) : 0;
  };

  return (
    <div className={cn('relative w-full aspect-video overflow-hidden rounded-2xl bg-black', className)}>
      <video
        ref={ref}
        src={src}
        controls
        onPlay={() => setPlaying(true)}
        onPause={onPause}
        className="h-full w-full object-contain"
      />
      {/* timeline marks */}
      <div className="absolute bottom-9 left-0 right-0 h-3">
        {marks.map((m, i) => (
          <div key={i}
            title={`${m.label} @ ${m.t}s`}
            className="absolute top-0 h-3 w-[2px] bg-white/70"
            style={{ left: `${percent(m.t)}%` }}
          />
        ))}
      </div>
      {/* hint */}
      <div className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-white/80 bg-black/45 px-2 py-1 rounded">
        hotkeys: <span className="font-mono">1</span>=shot <span className="font-mono">2</span>=foul <span className="font-mono">3</span>=rebound <span className="font-mono">M</span>=custom
      </div>
    </div>
  );
}
