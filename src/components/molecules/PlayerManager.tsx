import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Card,
  CardBody,
  useDisclosure
} from '@heroui/react';
import { PlayerCard } from '../atoms/PlayerCard';
import { usePlayerStore } from '../../stores/playerStore';
import type { Player } from '../../types';

interface PlayerManagerProps {
  onPlayersSelected?: (players: Player[]) => void;
  selectionMode?: boolean;
  selectedPlayers?: Player[];
  minPlayers?: number;
  maxPlayers?: number;
}

export const PlayerManager = ({
  onPlayersSelected,
  selectionMode = false,
  selectedPlayers = [],
  minPlayers = 2,
  maxPlayers = 32
}: PlayerManagerProps) => {
  const {
    players,
    loading,
    error,
    loadPlayers,
    addPlayer,
    updatePlayer,
    deletePlayer,
    initializeDefaultPlayers,
    clearError
  } = usePlayerStore();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<string>>(
    new Set(selectedPlayers.map(p => p.id))
  );
  const [newPlayerName, setNewPlayerName] = useState('');
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editPlayerName, setEditPlayerName] = useState('');

  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);

  useEffect(() => {
    if (selectionMode && onPlayersSelected) {
      const selected = players.filter(p => selectedPlayerIds.has(p.id));
      onPlayersSelected(selected);
    }
  }, [selectedPlayerIds, players, selectionMode, onPlayersSelected]);

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName.trim());
      setNewPlayerName('');
    }
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setEditPlayerName(player.name);
    onOpen();
  };

  const handleUpdatePlayer = () => {
    if (editingPlayer && editPlayerName.trim()) {
      updatePlayer(editingPlayer.id, { name: editPlayerName.trim() });
      setEditingPlayer(null);
      setEditPlayerName('');
      onClose();
    }
  };

  const handleDeletePlayer = (playerId: string) => {
    if (confirm('Are you sure you want to delete this player?')) {
      deletePlayer(playerId);
      setSelectedPlayerIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(playerId);
        return newSet;
      });
    }
  };

  const handlePlayerSelection = (player: Player) => {
    setSelectedPlayerIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(player.id)) {
        newSet.delete(player.id);
      } else if (newSet.size < maxPlayers) {
        newSet.add(player.id);
      }
      return newSet;
    });
  };

  const hasMinimumPlayers = selectedPlayerIds.size >= minPlayers;

  return (
    <div className="space-y-4">
      {/* Add new player */}
      <Card className="bg-gradient-to-br from-content1 to-content2 shadow-lg border border-divider/30">
        <CardBody className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">👤</span>
            <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Agregar Nuevo Jugador
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Nombre del jugador"
                value={newPlayerName}
                onValueChange={setNewPlayerName}
                onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
                className="flex-1"
              />
              <Button
                color="primary"
                variant="shadow"
                onPress={handleAddPlayer}
                isDisabled={!newPlayerName.trim() || loading}
                className="bg-gradient-to-r from-primary to-secondary font-semibold transform hover:scale-105 transition-transform"
                startContent="➕"
              >
                <span className="hidden sm:inline">Agregar Jugador</span>
                <span className="sm:hidden">Agregar</span>
              </Button>
            </div>
            {players.length === 0 && (
              <div className="flex justify-center">
                <Button
                  color="secondary"
                  variant="flat"
                  onPress={initializeDefaultPlayers}
                  startContent="👥"
                  size="sm"
                >
                  Agregar Jugadores por Defecto
                </Button>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Selection info */}
      {selectionMode && (
        <Card>
          <CardBody className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Seleccionar Jugadores para el Torneo</h3>
                <p className="text-sm text-foreground-600">
                  Seleccionados: {selectedPlayerIds.size} / {maxPlayers} jugadores
                  {!hasMinimumPlayers && (
                    <span className="text-danger ml-2">
                      (Minimum {minPlayers} required)
                    </span>
                  )}
                </p>
              </div>
              {selectedPlayerIds.size > 0 && (
                <Button
                  size="sm"
                  variant="light"
                  onPress={() => setSelectedPlayerIds(new Set())}
                >
                  Limpiar Selección
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Error display */}
      {error && (
        <Card className="border-danger-200 bg-danger-50">
          <CardBody className="p-4">
            <div className="flex justify-between items-center">
              <p className="text-danger text-sm">{error}</p>
              <Button size="sm" variant="light" onPress={clearError}>
                Dismiss
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Players list */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👥</span>
          <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Jugadores ({players.length})
          </h3>
        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-foreground-600">Cargando jugadores...</p>
          </div>
        )}

        {!loading && players.length === 0 && (
          <Card className="bg-gradient-to-br from-content1 to-content2 border border-divider/30">
            <CardBody className="p-6 sm:p-8 text-center">
              <div className="text-4xl sm:text-6xl mb-4">🎮</div>
              <p className="text-foreground-600 mb-2 text-lg font-semibold">¡Aún no hay jugadores!</p>
              <p className="text-sm text-foreground-500">
                Agrega tu primer jugador para empezar a competir
              </p>
            </CardBody>
          </Card>
        )}

        {!loading && players.length > 0 && (
          <div className="grid gap-3 sm:gap-4">
            {players.map(player => (
              <PlayerCard
                key={player.id}
                player={player}
                onEdit={() => handleEditPlayer(player)}
                onDelete={() => handleDeletePlayer(player.id)}
                selectable={selectionMode}
                selected={selectedPlayerIds.has(player.id)}
                onSelect={() => handlePlayerSelection(player)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit player modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Editar Jugador</ModalHeader>
          <ModalBody>
            <Input
              label="Nombre del Jugador"
              value={editPlayerName}
              onValueChange={setEditPlayerName}
              placeholder="Enter player name"
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancelar
            </Button>
            <Button
              color="primary"
              onPress={handleUpdatePlayer}
              isDisabled={!editPlayerName.trim()}
            >
              Actualizar Jugador
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};