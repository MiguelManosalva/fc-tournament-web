import { create } from 'zustand';
import type { Tournament, TournamentFormat, Player, Match, LeagueStanding } from '../types';
import { localStorageService } from '../services/localStorage.service';

interface TournamentState {
  tournaments: Tournament[];
  currentTournament: Tournament | null;
  loading: boolean;
  error: string | null;
}

interface TournamentActions {
  loadTournaments: () => void;
  loadCurrentTournament: () => void;
  createTournament: (name: string, format: TournamentFormat, players: Player[]) => void;
  setCurrentTournament: (tournament: Tournament | null) => void;
  updateTournament: (tournament: Tournament) => void;
  deleteTournament: (tournamentId: string) => void;
  startTournament: (tournamentId: string) => void;
  generateMatches: (tournament: Tournament) => Match[];
  updateMatchResult: (matchId: string, score1: number, score2: number) => void;
  editMatchResult: (matchId: string, score1: number, score2: number) => void;
  getLeagueStandings: (tournament: Tournament) => LeagueStanding[];
  clearError: () => void;
}

type TournamentStore = TournamentState & TournamentActions;

export const useTournamentStore = create<TournamentStore>((set, get) => ({
  // State
  tournaments: [],
  currentTournament: null,
  loading: false,
  error: null,

  // Actions
  loadTournaments: () => {
    set({ loading: true, error: null });
    try {
      const tournaments = localStorageService.getTournaments();
      set({ tournaments, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error loading tournaments',
        loading: false
      });
    }
  },

  loadCurrentTournament: () => {
    try {
      const currentTournament = localStorageService.getCurrentTournament();
      set({ currentTournament: currentTournament || null });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error loading current tournament'
      });
    }
  },

  createTournament: (name: string, format: TournamentFormat, players: Player[]) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      set({ error: 'Tournament name cannot be empty' });
      return;
    }

    if (players.length < 2) {
      set({ error: 'Tournament must have at least 2 players' });
      return;
    }

    const { tournaments } = get();

    // Check if tournament name already exists
    if (tournaments.some(t => t.name.toLowerCase() === trimmedName.toLowerCase())) {
      set({ error: 'A tournament with this name already exists' });
      return;
    }

    const newTournament: Tournament = {
      id: crypto.randomUUID(),
      name: trimmedName,
      format,
      players: [...players],
      matches: [],
      status: 'setup',
      createdAt: new Date(),
    };

    try {
      localStorageService.saveTournament(newTournament);
      set({
        tournaments: [...tournaments, newTournament],
        currentTournament: newTournament,
        error: null
      });
      localStorageService.setCurrentTournament(newTournament);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error creating tournament'
      });
    }
  },

  setCurrentTournament: (tournament: Tournament | null) => {
    try {
      localStorageService.setCurrentTournament(tournament || undefined);
      set({ currentTournament: tournament });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error setting current tournament'
      });
    }
  },

  updateTournament: (tournament: Tournament) => {
    const { tournaments } = get();

    try {
      localStorageService.saveTournament(tournament);
      const updatedTournaments = tournaments.map(t =>
        t.id === tournament.id ? tournament : t
      );

      set({
        tournaments: updatedTournaments,
        currentTournament: get().currentTournament?.id === tournament.id ? tournament : get().currentTournament,
        error: null
      });

      // Update current tournament in storage if it's the active one
      if (get().currentTournament?.id === tournament.id) {
        localStorageService.setCurrentTournament(tournament);
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error updating tournament'
      });
    }
  },

  deleteTournament: (tournamentId: string) => {
    const { tournaments } = get();

    try {
      localStorageService.deleteTournament(tournamentId);
      set({
        tournaments: tournaments.filter(t => t.id !== tournamentId),
        currentTournament: get().currentTournament?.id === tournamentId ? null : get().currentTournament,
        error: null
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error deleting tournament'
      });
    }
  },

  startTournament: (tournamentId: string) => {
    const { tournaments } = get();
    const tournament = tournaments.find(t => t.id === tournamentId);

    if (!tournament) {
      set({ error: 'Tournament not found' });
      return;
    }

    if (tournament.players.length < 2) {
      set({ error: 'Tournament must have at least 2 players to start' });
      return;
    }

    // Generate matches based on format
    const matches = get().generateMatches(tournament);

    const updatedTournament: Tournament = {
      ...tournament,
      matches,
      status: 'in_progress'
    };

    get().updateTournament(updatedTournament);
  },

  generateMatches: (tournament: Tournament): Match[] => {
    const { players, format } = tournament;

    if (format === 'league') {
      // Round-robin: every player plays every other player
      const matches: Match[] = [];
      let matchNumber = 1;

      for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
          matches.push({
            id: crypto.randomUUID(),
            tournamentId: tournament.id,
            player1: players[i],
            player2: players[j],
            completed: false,
            round: 1,
            matchNumber: matchNumber++
          });
        }
      }

      return matches;
    } else if (format === 'knockout') {
      // Single elimination bracket
      const matches: Match[] = [];
      const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
      const currentRound = 1;
      let matchNumber = 1;

      // Calculate number of rounds needed
      const totalRounds = Math.ceil(Math.log2(players.length));

      // First round: pair up players
      for (let i = 0; i < shuffledPlayers.length; i += 2) {
        if (i + 1 < shuffledPlayers.length) {
          matches.push({
            id: crypto.randomUUID(),
            tournamentId: tournament.id,
            player1: shuffledPlayers[i],
            player2: shuffledPlayers[i + 1],
            completed: false,
            round: currentRound,
            matchNumber: matchNumber++
          });
        }
      }

      // Generate placeholder matches for subsequent rounds
      let playersInRound = Math.ceil(shuffledPlayers.length / 2);
      for (let round = 2; round <= totalRounds; round++) {
        const matchesInRound = Math.floor(playersInRound / 2);
        playersInRound = matchesInRound;

        for (let i = 0; i < matchesInRound; i++) {
          matches.push({
            id: crypto.randomUUID(),
            tournamentId: tournament.id,
            player1: { id: 'tbd', name: 'TBD', createdAt: new Date() },
            player2: { id: 'tbd', name: 'TBD', createdAt: new Date() },
            completed: false,
            round,
            matchNumber: matchNumber++
          });
        }
      }

      return matches;
    } else if (format === 'champions') {
      // Champions League format: ALL players in ONE group + knockouts
      const matches: Match[] = [];
      const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
      let matchNumber = 1;

      const isOddPlayers = shuffledPlayers.length % 2 === 1;

      if (isOddPlayers) {
        // For odd number of players, we need more rounds to ensure everyone plays the same amount
        // Each player will play (totalPlayers - 1) matches, which ensures they play against most others
        const totalRounds = shuffledPlayers.length; // One round per player for bye rotation

        // Create a schedule where each player gets exactly one bye per full cycle
        for (let round = 1; round <= totalRounds; round++) {
          const availablePlayers = [...shuffledPlayers];
          const roundMatches: Match[] = [];

          // The player who gets a bye this round (rotate through all players)
          const byePlayerIndex = (round - 1) % shuffledPlayers.length;
          availablePlayers.splice(byePlayerIndex, 1); // Remove bye player

          // Pair remaining players
          while (availablePlayers.length >= 2) {
            const player1 = availablePlayers.shift()!;
            const player2 = availablePlayers.shift()!;

            roundMatches.push({
              id: crypto.randomUUID(),
              tournamentId: tournament.id,
              player1,
              player2,
              completed: false,
              round: round,
              matchNumber: matchNumber++
            });
          }

          matches.push(...roundMatches);
        }
      } else {
        // For even number of players, use the original 3-round system
        const rounds = 3;

        for (let round = 1; round <= rounds; round++) {
          const availablePlayers = [...shuffledPlayers];
          const roundMatches: Match[] = [];

          // Pair players randomly for this round
          while (availablePlayers.length >= 2) {
            const player1Index = 0;
            const player2Index = Math.floor(Math.random() * (availablePlayers.length - 1)) + 1;

            const player1 = availablePlayers[player1Index];
            const player2 = availablePlayers[player2Index];

            roundMatches.push({
              id: crypto.randomUUID(),
              tournamentId: tournament.id,
              player1,
              player2,
              completed: false,
              round: round,
              matchNumber: matchNumber++
            });

            // Remove paired players from available list
            availablePlayers.splice(Math.max(player1Index, player2Index), 1);
            availablePlayers.splice(Math.min(player1Index, player2Index), 1);
          }

          matches.push(...roundMatches);
        }
      }

      // Generate knockout phase (Semifinals + Final)
      // Top 4 players advance: 1st vs 4th, 2nd vs 3rd
      const groupStageRounds = isOddPlayers ? shuffledPlayers.length : 3;
      const semifinalRound = groupStageRounds + 1;
      const finalRound = semifinalRound + 1;

      // Semifinal 1: 1° vs 4°
      matches.push({
        id: crypto.randomUUID(),
        tournamentId: tournament.id,
        player1: { id: 'tbd-1st', name: '1° Clasificado', createdAt: new Date() },
        player2: { id: 'tbd-4th', name: '4° Clasificado', createdAt: new Date() },
        completed: false,
        round: semifinalRound,
        matchNumber: matchNumber++
      });

      // Semifinal 2: 2° vs 3°
      matches.push({
        id: crypto.randomUUID(),
        tournamentId: tournament.id,
        player1: { id: 'tbd-2nd', name: '2° Clasificado', createdAt: new Date() },
        player2: { id: 'tbd-3rd', name: '3° Clasificado', createdAt: new Date() },
        completed: false,
        round: semifinalRound,
        matchNumber: matchNumber++
      });

      // Partido por el 3er lugar (perdedores de semifinales)
      matches.push({
        id: crypto.randomUUID(),
        tournamentId: tournament.id,
        player1: { id: 'tbd-sf1-loser', name: 'Perdedor Semifinal 1', createdAt: new Date() },
        player2: { id: 'tbd-sf2-loser', name: 'Perdedor Semifinal 2', createdAt: new Date() },
        completed: false,
        round: finalRound,
        matchNumber: matchNumber++
      });

      // Final
      matches.push({
        id: crypto.randomUUID(),
        tournamentId: tournament.id,
        player1: { id: 'tbd-sf1-winner', name: 'Ganador Semifinal 1', createdAt: new Date() },
        player2: { id: 'tbd-sf2-winner', name: 'Ganador Semifinal 2', createdAt: new Date() },
        completed: false,
        round: finalRound,
        matchNumber: matchNumber++
      });

      return matches;
    }

    return [];
  },

  updateMatchResult: (matchId: string, score1: number, score2: number) => {
    const { currentTournament } = get();
    if (!currentTournament) {
      set({ error: 'No active tournament' });
      return;
    }

    const matchIndex = currentTournament.matches.findIndex(m => m.id === matchId);
    if (matchIndex === -1) {
      set({ error: 'Match not found' });
      return;
    }

    const match = currentTournament.matches[matchIndex];
    const winner = score1 > score2 ? match.player1 : score1 < score2 ? match.player2 : undefined;

    const updatedMatch: Match = {
      ...match,
      score1,
      score2,
      winner,
      completed: true,
      playedAt: new Date()
    };

    const updatedMatches = [...currentTournament.matches];
    updatedMatches[matchIndex] = updatedMatch;

    // For Champions League format, update knockout phase when group stage is complete
    if (currentTournament.format === 'champions') {
      // Determine how many rounds the group stage has based on player count
      const isOddPlayers = currentTournament.players.length % 2 === 1;
      const groupStageRounds = isOddPlayers ? currentTournament.players.length : 3;

      const groupMatches = updatedMatches.filter(m => m.round && m.round <= groupStageRounds);
      const groupStageComplete = groupMatches.every(m => m.completed);

      if (groupStageComplete) {
        // Get standings and update knockout matches with qualified players
        const standings = get().getLeagueStandings({ ...currentTournament, matches: updatedMatches });
        const qualified = standings.slice(0, 4); // Top 4 players

        console.log('🏆 Group stage complete! Updating knockout phase...');
        console.log('📊 Standings:', standings.map(s => `${s.player.name} (${s.points} pts)`));
        console.log('🎯 Qualified:', qualified.map(q => q.player.name));

        // Update semifinal matches
        const semifinalRound = groupStageRounds + 1;

        for (let i = 0; i < updatedMatches.length; i++) {
          const match = updatedMatches[i];

          if (match.round === semifinalRound && !match.completed) {
            console.log(`🏟️ Checking match ${match.id}:`, match.player1.name, 'vs', match.player2.name);

            // Semifinal 1: 1st vs 4th
            if (match.player1.id === 'tbd-1st' && qualified[0]) {
              console.log(`✅ Updating Player 1 to ${qualified[0].player.name}`);
              updatedMatches[i] = { ...match, player1: qualified[0].player };
            }
            if (match.player2.id === 'tbd-4th' && qualified[3]) {
              console.log(`✅ Updating Player 2 to ${qualified[3].player.name}`);
              updatedMatches[i] = { ...match, player2: qualified[3].player };
            }

            // Semifinal 2: 2nd vs 3rd
            if (match.player1.id === 'tbd-2nd' && qualified[1]) {
              console.log(`✅ Updating Player 1 to ${qualified[1].player.name}`);
              updatedMatches[i] = { ...match, player1: qualified[1].player };
            }
            if (match.player2.id === 'tbd-3rd' && qualified[2]) {
              console.log(`✅ Updating Player 2 to ${qualified[2].player.name}`);
              updatedMatches[i] = { ...match, player2: qualified[2].player };
            }
          }
        }
      }

      // Update final match when semifinals are complete
      const semifinalRound = groupStageRounds + 1;
      const semifinalMatches = updatedMatches.filter(m => m.round === semifinalRound);
      const semifinalsComplete = semifinalMatches.every(m => m.completed);

      if (semifinalsComplete) {
        const sf1Match = semifinalMatches[0];
        const sf2Match = semifinalMatches[1];

        const sf1Winner = sf1Match?.winner;
        const sf2Winner = sf2Match?.winner;

        // Determine losers (the player who is not the winner)
        const sf1Loser = sf1Match ? (sf1Match.winner?.id === sf1Match.player1.id ? sf1Match.player2 : sf1Match.player1) : null;
        const sf2Loser = sf2Match ? (sf2Match.winner?.id === sf2Match.player1.id ? sf2Match.player2 : sf2Match.player1) : null;

        for (let i = 0; i < updatedMatches.length; i++) {
          const match = updatedMatches[i];

          const finalRound = semifinalRound + 1;
          if (match.round === finalRound && !match.completed) {
            // Update third place playoff
            if (match.player1.id === 'tbd-sf1-loser' && sf1Loser) {
              updatedMatches[i] = { ...match, player1: sf1Loser };
            }
            if (match.player2.id === 'tbd-sf2-loser' && sf2Loser) {
              updatedMatches[i] = { ...match, player2: sf2Loser };
            }

            // Update final
            if (match.player1.id === 'tbd-sf1-winner' && sf1Winner) {
              updatedMatches[i] = { ...match, player1: sf1Winner };
            }
            if (match.player2.id === 'tbd-sf2-winner' && sf2Winner) {
              updatedMatches[i] = { ...match, player2: sf2Winner };
            }
          }
        }
      }
    }

    // Check if tournament is completed
    const allMatchesCompleted = updatedMatches.every(m => m.completed || m.player1.id.startsWith('tbd') || m.player2.id.startsWith('tbd'));

    let tournamentWinner: Player | undefined;
    let status: Tournament['status'] = currentTournament.status;

    if (allMatchesCompleted) {
      status = 'completed';

      if (currentTournament.format === 'league') {
        const standings = get().getLeagueStandings({ ...currentTournament, matches: updatedMatches });
        tournamentWinner = standings[0]?.player;
      } else if (currentTournament.format === 'knockout') {
        // Find the final match winner
        const finalMatches = updatedMatches.filter(m => m.completed);
        const lastRound = Math.max(...finalMatches.map(m => m.round || 0));
        const finalMatch = finalMatches.find(m => m.round === lastRound);
        tournamentWinner = finalMatch?.winner;
      } else if (currentTournament.format === 'champions') {
        // Find the final match winner
        const finalMatch = updatedMatches.find(m => m.round === 5 && m.completed);
        tournamentWinner = finalMatch?.winner;
      }
    }

    const updatedTournament: Tournament = {
      ...currentTournament,
      matches: updatedMatches,
      status,
      winner: tournamentWinner,
      completedAt: status === 'completed' ? new Date() : undefined
    };

    get().updateTournament(updatedTournament);
  },

  editMatchResult: (matchId: string, score1: number, score2: number) => {
    const { currentTournament } = get();
    if (!currentTournament) {
      set({ error: 'No active tournament' });
      return;
    }

    const matchIndex = currentTournament.matches.findIndex(m => m.id === matchId);
    if (matchIndex === -1) {
      set({ error: 'Match not found' });
      return;
    }

    const match = currentTournament.matches[matchIndex];
    if (!match.completed) {
      set({ error: 'Cannot edit uncompleted match' });
      return;
    }

    const winner = score1 > score2 ? match.player1 : score1 < score2 ? match.player2 : undefined;

    const updatedMatch: Match = {
      ...match,
      score1,
      score2,
      winner,
      playedAt: new Date() // Update timestamp when edited
    };

    const updatedMatches = [...currentTournament.matches];
    updatedMatches[matchIndex] = updatedMatch;

    // For Champions League, need to recalculate and update knockout phase
    if (currentTournament.format === 'champions') {
      const groupMatches = updatedMatches.filter(m => m.round && m.round <= 3);
      const groupStageComplete = groupMatches.every(m => m.completed);

      if (groupStageComplete) {
        // Recalculate standings and update knockout matches
        const standings = get().getLeagueStandings({ ...currentTournament, matches: updatedMatches });
        const qualified = standings.slice(0, 4);

        // Reset and update semifinal matches if they haven't been played yet
        const semifinalRound = 4;
        for (let i = 0; i < updatedMatches.length; i++) {
          const match = updatedMatches[i];

          if (match.round === semifinalRound && !match.completed) {
            if (match.player1.id === qualified[0]?.player.id || match.player1.id === 'tbd-1st') {
              updatedMatches[i] = { ...match, player1: qualified[0]?.player || { id: 'tbd-1st', name: '1° Clasificado', createdAt: new Date() } };
            }
            if (match.player1.id === qualified[1]?.player.id || match.player1.id === 'tbd-2nd') {
              updatedMatches[i] = { ...match, player1: qualified[1]?.player || { id: 'tbd-2nd', name: '2° Clasificado', createdAt: new Date() } };
            }
            if (match.player2.id === qualified[2]?.player.id || match.player2.id === 'tbd-3rd') {
              updatedMatches[i] = { ...match, player2: qualified[2]?.player || { id: 'tbd-3rd', name: '3° Clasificado', createdAt: new Date() } };
            }
            if (match.player2.id === qualified[3]?.player.id || match.player2.id === 'tbd-4th') {
              updatedMatches[i] = { ...match, player2: qualified[3]?.player || { id: 'tbd-4th', name: '4° Clasificado', createdAt: new Date() } };
            }
          }
        }
      }
    }

    const updatedTournament: Tournament = {
      ...currentTournament,
      matches: updatedMatches
    };

    get().updateTournament(updatedTournament);
  },

  getLeagueStandings: (tournament: Tournament): LeagueStanding[] => {
    const standings: { [playerId: string]: LeagueStanding } = {};

    // Initialize standings for all players
    tournament.players.forEach(player => {
      standings[player.id] = {
        player,
        points: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        gamesPlayed: 0
      };
    });

    // Calculate standings from completed matches
    tournament.matches.filter(m => m.completed).forEach(match => {
      const { player1, player2, score1 = 0, score2 = 0 } = match;

      if (standings[player1.id]) {
        standings[player1.id].gamesPlayed++;
        standings[player1.id].goalsFor += score1;
        standings[player1.id].goalsAgainst += score2;

        if (score1 > score2) {
          standings[player1.id].wins++;
          standings[player1.id].points += 3;
        } else if (score1 === score2) {
          standings[player1.id].draws++;
          standings[player1.id].points += 1;
        } else {
          standings[player1.id].losses++;
        }
      }

      if (standings[player2.id]) {
        standings[player2.id].gamesPlayed++;
        standings[player2.id].goalsFor += score2;
        standings[player2.id].goalsAgainst += score1;

        if (score2 > score1) {
          standings[player2.id].wins++;
          standings[player2.id].points += 3;
        } else if (score2 === score1) {
          standings[player2.id].draws++;
          standings[player2.id].points += 1;
        } else {
          standings[player2.id].losses++;
        }
      }
    });

    // Calculate goal difference
    Object.values(standings).forEach(standing => {
      standing.goalDifference = standing.goalsFor - standing.goalsAgainst;
    });

    // Sort by points, then goal difference, then goals for
    return Object.values(standings).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));