export interface Sentence {
  french: string;
  english: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  sentences: Sentence[];
}

export type AppMode = 'home' | 'collections' | 'practice' | 'ai' | 'tef' | 'normal-practice';

export enum PracticeState {
  SELECTING = 'SELECTING',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}
