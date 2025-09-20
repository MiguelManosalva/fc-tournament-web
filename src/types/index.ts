// Types for the FIFA Tournament Manager

export type TournamentFormat = 'league' | 'knockout' | 'champions';

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

export interface Match {
  id: string;
  tournamentId: string;
  player1: Player;
  player2: Player;
  score1?: number;
  score2?: number;
  winner?: Player;
  completed: boolean;
  round?: number;
  matchNumber?: number;
  playedAt?: Date;
}

export interface Tournament {
  id: string;
  name: string;
  format: TournamentFormat;
  players: Player[];
  matches: Match[];
  status: 'setup' | 'in_progress' | 'completed';
  winner?: Player;
  createdAt: Date;
  completedAt?: Date;
}

export interface LeagueStanding {
  player: Player;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  gamesPlayed: number;
}

export interface KnockoutBracket {
  rounds: {
    roundNumber: number;
    matches: Match[];
  }[];
}

export interface ChampionsGroup {
  id: string;
  name: string;
  players: Player[];
  matches: Match[];
  standings: LeagueStanding[];
}

export interface ChampionsPhase {
  groups: ChampionsGroup[];
  knockoutMatches: Match[];
  currentPhase: 'groups' | 'semifinals' | 'final' | 'completed';
}

// Storage interfaces
export interface TournamentStorage {
  tournaments: Tournament[];
  currentTournament?: Tournament;
}

export interface PlayerStorage {
  players: Player[];
}

export interface AppStorage {
  tournaments: TournamentStorage;
  players: PlayerStorage;
  lastUpdated: Date;
}