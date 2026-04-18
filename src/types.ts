export type Point = {
  x: number;
  y: number;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export type Track = {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  cover: string;
};

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cybernetic Pulse',
    artist: 'AI Synth Horizon',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372,
    cover: 'https://picsum.photos/seed/cyber/400/400'
  },
  {
    id: '2',
    title: 'Neon Drift',
    artist: 'Digital Echo',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 425,
    cover: 'https://picsum.photos/seed/neon/400/400'
  },
  {
    id: '3',
    title: 'Grid Runner',
    artist: 'Logic Core',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 312,
    cover: 'https://picsum.photos/seed/grid/400/400'
  }
];
