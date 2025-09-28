'use client';

import { useEffect, useRef, useState } from 'react';

export function useSocket(url: string | undefined) {
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<'closed'|'connecting'|'open'|'error'>('closed');
  const [messages, setMessages] = useState<any[]>([]);
  const backoff = useRef(400);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;

    const connect = () => {
      if (cancelled) return;
      setStatus('connecting');
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => { setStatus('open'); backoff.current = 400; };
      ws.onerror = () => setStatus('error');
      ws.onclose = () => {
        setStatus('closed');
        wsRef.current = null;
        setTimeout(() => !cancelled && connect(), backoff.current);
        backoff.current = Math.min(backoff.current * 2, 4000);
      };
      ws.onmessage = (ev) => {
        try { setMessages(m => [...m.slice(-99), JSON.parse(ev.data)]); } catch {}
      };
    };

    connect();
    return () => { cancelled = true; wsRef.current?.close(); };
  }, [url]);

  const send = (payload: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  };

  return { status, messages, send };
}
