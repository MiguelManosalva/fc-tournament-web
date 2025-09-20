import type { Tournament, Player, AppStorage } from '../types';

const STORAGE_KEY = 'fifa_tournament_manager';

// Default storage structure
const getDefaultStorage = (): AppStorage => ({
  tournaments: {
    tournaments: [],
    currentTournament: undefined,
  },
  players: {
    players: [],
  },
  lastUpdated: new Date(),
});

// Generic storage utilities
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;

    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    return convertDates(parsed) as T;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Convert date strings back to Date objects
const convertDates = (obj: unknown): unknown => {
  if (obj === null || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(convertDates);
  }

  const converted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && isDateString(value)) {
      converted[key] = new Date(value);
    } else if (typeof value === 'object') {
      converted[key] = convertDates(value);
    } else {
      converted[key] = value;
    }
  }
  return converted;
};

const isDateString = (str: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
  return dateRegex.test(str) && !isNaN(Date.parse(str));
};

// Storage service class
export class LocalStorageService {
  private static instance: LocalStorageService;

  static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }

  // Get all data
  getAll(): AppStorage {
    return getFromStorage(STORAGE_KEY, getDefaultStorage());
  }

  // Save all data
  saveAll(data: AppStorage): void {
    saveToStorage(STORAGE_KEY, { ...data, lastUpdated: new Date() });
  }

  // Tournament operations
  getTournaments(): Tournament[] {
    const data = this.getAll();
    return data.tournaments.tournaments;
  }

  saveTournament(tournament: Tournament): void {
    const data = this.getAll();
    const index = data.tournaments.tournaments.findIndex(t => t.id === tournament.id);

    if (index >= 0) {
      data.tournaments.tournaments[index] = tournament;
    } else {
      data.tournaments.tournaments.push(tournament);
    }

    this.saveAll(data);
  }

  deleteTournament(tournamentId: string): void {
    const data = this.getAll();
    data.tournaments.tournaments = data.tournaments.tournaments.filter(
      t => t.id !== tournamentId
    );

    if (data.tournaments.currentTournament?.id === tournamentId) {
      data.tournaments.currentTournament = undefined;
    }

    this.saveAll(data);
  }

  getCurrentTournament(): Tournament | undefined {
    const data = this.getAll();
    return data.tournaments.currentTournament;
  }

  setCurrentTournament(tournament: Tournament | undefined): void {
    const data = this.getAll();
    data.tournaments.currentTournament = tournament;
    this.saveAll(data);
  }

  // Player operations
  getPlayers(): Player[] {
    const data = this.getAll();
    return data.players.players;
  }

  savePlayer(player: Player): void {
    const data = this.getAll();
    const index = data.players.players.findIndex(p => p.id === player.id);

    if (index >= 0) {
      data.players.players[index] = player;
    } else {
      data.players.players.push(player);
    }

    this.saveAll(data);
  }

  deletePlayer(playerId: string): void {
    const data = this.getAll();
    data.players.players = data.players.players.filter(p => p.id !== playerId);
    this.saveAll(data);
  }

  // Clear all data
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  // Export data for backup
  exportData(): string {
    const data = this.getAll();
    return JSON.stringify(data, null, 2);
  }

  // Import data from backup
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData) as AppStorage;
      this.saveAll(data);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

// Export singleton instance
export const localStorageService = LocalStorageService.getInstance();