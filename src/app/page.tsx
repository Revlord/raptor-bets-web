'use client';

import { useEffect, useRef, useState } from 'react';
import { useSocket } from './lib/socket';
import type { Outgoing, Incoming } from './lib/types';
import VideoPlayer from '@/components/VideoPlayer';
import MomentumSparkline from '@/components/MomentumSparkline';
import QuestionCard from '@/components/QuestionCard';
import Leaderboard from '@/components/Leaderboard';
import StatusBar from '@/components/StatusBar';
import { Button } from '@/components/ui/button';

export default function Page() {
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
  const GAME_ID = process.env.NEXT_PUBLIC_GAME_ID || 'alpha-demo-1';

  const { status: wsStatus, messages, send } = useSocket(WS_URL);
  const videoTimeRef = useRef(0);

  const [question, setQuestion] = useState<{ id: string; text: string; options: string[]; closeAt?: number } | null>(null);
  const [leaderboard, setLeaderboard] = useState<{ handle: string; pnl: number; rank: number }[]>([]);
  const [momentum, setMomentum] = useState<{ t: number; value: number }[]>([]);

  // hello on open
  useEffect(() => {
    if (wsStatus !== 'open') return;
    const hello: Outgoing = { type: 'HELLO', gameId: GAME_ID };
    send(hello);
  }, [wsStatus, GAME_ID, send]);

  // inbound
  useEffect(() => {
    const last = messages[messages.length - 1] as Incoming | undefined;
    if (!last) return;
    if (last.type === 'QUESTION') setQuestion({ id: last.id, text: last.text, options: last.options, closeAt: last.closeAt });
    if (last.type === 'LEADERBOARD') setLeaderboard(last.rows);
    if (last.type === 'MOMENTUM') setMomentum(last.series);
  }, [messages]);

  // video heartbeats
  const onTick = (t: number, playing: boolean) => {
    videoTimeRef.current = t;
    const msg: Outgoing = { type: 'HEARTBEAT', gameId: GAME_ID, videoTime: t, playing, now: Date.now() };
    send(msg);
  };

  // marks
  const onMark = (label: string, t: number) => {
    const msg: Outgoing = { type: 'MARK', gameId: GAME_ID, label, videoTime: t, now: Date.now() };
    send(msg);
  };

  // quick controls (optional – kept on same page)
  const openQ = () => send({ type: 'CONTROL', gameId: GAME_ID, action: 'OPEN_Q', payload: { at: videoTimeRef.current } } as Outgoing);
  const closeQ = () => send({ type: 'CONTROL', gameId: GAME_ID, action: 'CLOSE_Q' } as Outgoing);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">AlphaBet — Live Console</h1>
          <StatusBar wsStatus={wsStatus} />
        </header>

        <section className="grid md:grid-cols-[2fr,1fr] gap-6">
          {/* left: video + overlay + controls */}
          <div className="space-y-3">
            <div className="relative">
              <VideoPlayer src="/clip1.mp4" onTick={onTick} onMark={onMark} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
