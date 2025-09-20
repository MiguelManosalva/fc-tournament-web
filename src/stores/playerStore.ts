import { create } from 'zustand';
import type { Player } from '../types';
import { localStorageService } from '../services/localStorage.service';

interface PlayerState {
  players: Player[];
  loading: boolean;
  error: string | null;
}

interface PlayerActions {
  loadPlayers: () => void;
  addPlayer: (name: string) => void;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  deletePlayer: (id: string) => void;
  initializeDefaultPlayers: () => void;
  clearError: () => void;
}

type PlayerStore = PlayerState & PlayerActions;

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  // State
  players: [],
  loading: false,
  error: null,

  // Actions
  loadPlayers: () => {
    set({ loading: true, error: null });
    try {
      const players = localStorageService.getPlayers();
      set({ players, loading: false });

      // Initialize default players if none exist
      if (players.length === 0) {
        get().initializeDefaultPlayers();
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error cargando jugadores',
        loading: false
      });
    }
  },

  initializeDefaultPlayers: () => {
    const defaultPlayerNames = ['Nacho', 'Pelao', 'Tancio', 'Benjamin', 'Migue', 'Basti'];
    const { players } = get();

    // Only add default players if none exist
    if (players.length > 0) return;

    try {
      const newPlayers: Player[] = defaultPlayerNames.map(name => ({
        id: crypto.randomUUID(),
        name,
        createdAt: new Date(),
      }));

      // Save each player
      newPlayers.forEach(player => {
        localStorageService.savePlayer(player);
      });

      set({
        players: newPlayers,
        error: null
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error inicializando jugadores por defecto'
      });
    }
  },

  addPlayer: (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      set({ error: 'El nombre del jugador no puede estar vacío' });
      return;
    }

    const { players } = get();

    // Check if player name already exists
    if (players.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      set({ error: 'Ya existe un jugador con este nombre' });
      return;
    }

    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: trimmedName,
      createdAt: new Date(),
    };

    try {
      localStorageService.savePlayer(newPlayer);
      set({
        players: [...players, newPlayer],
        error: null
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error agregando jugador'
      });
    }
  },

  updatePlayer: (id: string, updates: Partial<Player>) => {
    const { players } = get();
    const playerIndex = players.findIndex(p => p.id === id);

    if (playerIndex === -1) {
      set({ error: 'Jugador no encontrado' });
      return;
    }

    const updatedPlayer = { ...players[playerIndex], ...updates };

    // Check name uniqueness if name is being updated
    if (updates.name) {
      const trimmedName = updates.name.trim();
      if (!trimmedName) {
        set({ error: 'El nombre del jugador no puede estar vacío' });
        return;
      }

      if (players.some(p => p.id !== id && p.name.toLowerCase() === trimmedName.toLowerCase())) {
        set({ error: 'Ya existe un jugador con este nombre' });
        return;
      }

      updatedPlayer.name = trimmedName;
    }

    try {
      localStorageService.savePlayer(updatedPlayer);
      const newPlayers = [...players];
      newPlayers[playerIndex] = updatedPlayer;
      set({
        players: newPlayers,
        error: null
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error actualizando jugador'
      });
    }
  },

  deletePlayer: (id: string) => {
    const { players } = get();

    try {
      localStorageService.deletePlayer(id);
      set({
        players: players.filter(p => p.id !== id),
        error: null
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error eliminando jugador'
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));