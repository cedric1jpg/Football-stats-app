export interface League {
  id: number;
  name: string;
  country: string;
  type: 'League'; // Filter
}

export interface Player {
  id: number;
  name: string;
  age?: number;
  number?: number;
  position: string;
  team_id: number;
  season?: string;
  goals: number;
  assists: number;
  played: number;
  rating?: number; // Computed (optional because not all sources provide it)
  photo?: string;
}

export interface NewsItem {
  title: string;
  snippet: string;
  url: string;
  date: string;
  img?: string;
}

export interface Fixture {
  date: string;
  opponent: string;
  score: string;
  venue: 'home' | 'away';
}

export interface Transfer {
  player: string;
  type: 'in' | 'out';
  from?: string;
  to?: string;
  fee?: string;
  date: string;
}

export interface Team {
  id: number;
  name: string;
  country?: string;
  founded?: number;
  league?: string;
  league_id?: number;
  attack: number | string;
  defense: number | string;
  rating: number;
  total_goals?: number;
  total_played?: number;
  logo?: string;
  banner?: string[]; // Array of images for slideshow
  goal_diff: number;
  gf?: number;
  ga?: number;
  points?: number;
  form?: string;
  players?: Player[]; // Aggregated
  news?: NewsItem[];
  fixtures?: Fixture[];
  transfers?: Transfer[];
  formation?: { def: number; mid: number; fwd: number };
  quickStats?: { attack: number; defense: number };
}
