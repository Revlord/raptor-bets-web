export type Outgoing =
  | { type: 'HELLO'; gameId: string }
  | { type: 'HEARTBEAT'; gameId: string; videoTime: number; playing: boolean; now: number }
  | { type: 'MARK'; gameId: string; label: string; videoTime: number; now: number }
  | { type: 'CONTROL'; gameId: string; action: 'OPEN_Q'|'CLOSE_Q'|'OPEN_QUARTER'|'CLOSE_QUARTER'; payload?: Record<string, unknown> };

export type Incoming =
  | { type: 'ACK' }
  | { type: 'QUESTION'; id: string; text: string; options: string[]; closeAt?: number }
  | { type: 'LEADERBOARD'; rows: { handle: string; pnl: number; rank: number }[] }
  | { type: 'MOMENTUM'; series: { t: number; value: number }[] }
  | { type: 'PING' };
