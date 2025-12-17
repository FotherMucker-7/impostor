export enum GamePhase {
  SETUP = 'SETUP',
  REVEAL = 'REVEAL',
  PLAY = 'PLAY',
  VOTE = 'VOTE',
  RESULT = 'RESULT'
}

export enum PlayerRole {
  CIVILIAN = 'CIVIL',
  IMPOSTOR = 'IMPOSTOR'
}

export interface Player {
  id: number;
  name: string;
  role: PlayerRole;
  isRevealed: boolean;
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  category: string;
  secretWord: string;
  currentPlayerRevealIndex: number;
  startingPlayerIndex: number;
  timeElapsed: number;
  winner: PlayerRole | null;
  votedPlayerId: number | null;
}

export interface WordConfig {
  category: string;
  word: string;
}

export type CategoryType = 'CLASSIC' | 'AI';
