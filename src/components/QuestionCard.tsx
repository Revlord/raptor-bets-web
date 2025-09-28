'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function QuestionCard({
  question,
}:{
  question: { id: string; text: string; options: string[]; closeAt?: number } | null;
}) {
  if (!question) return null;

  const timeLeft = question.closeAt ? Math.max(0, Math.floor((question.closeAt - Date.now())/1000)) : undefined;

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={question.id}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="rounded-xl border border-white/10 bg-neutral-900/85 backdrop-blur px-4 py-3 shadow-xl"
      >
        <div className="text-xs text-neutral-400">Live Question {timeLeft !== undefined && `• ${timeLeft}s`}</div>
        <div className="text-base font-medium mt-1">{question.text}</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {question.options.map(opt => (
            <div key={opt} className="px-2 py-1 rounded bg-white/10 text-sm">{opt}</div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
