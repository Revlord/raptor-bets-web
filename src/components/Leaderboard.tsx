'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function Leaderboard({ rows }:{
  rows: { handle: string; pnl: number; rank: number }[];
}) {
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <div className="text-sm mb-2">Leaderboard</div>
      <div className="space-y-1">
        <AnimatePresence>
          {rows.map(r => (
            <motion.div
              key={r.handle}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 text-neutral-400">#{r.rank}</div>
                <div className="font-medium">{r.handle}</div>
              </div>
              <div className={r.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {r.pnl >= 0 ? '+' : ''}{r.pnl}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {rows.length === 0 && <div className="text-xs text-neutral-500">waiting for players…</div>}
      </div>
    </div>
  );
}
