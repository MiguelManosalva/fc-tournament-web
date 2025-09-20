import { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Divider
} from '@heroui/react';
import { FormatSelector } from '../atoms/FormatSelector';
import { PlayerManager } from '../molecules/PlayerManager';
import { useTournamentStore } from '../../stores/tournamentStore';
import type { TournamentFormat, Player } from '../../types';

interface TournamentCreatorProps {
  onTournamentCreated?: () => void;
}

export const TournamentCreator = ({ onTournamentCreated }: TournamentCreatorProps) => {
  const { createTournament, error, clearError } = useTournamentStore();
  const [tournamentName, setTournamentName] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<TournamentFormat>('league');
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTournament = async () => {
    if (!tournamentName.trim()) {
      return;
    }

    if (selectedPlayers.length < 2) {
      return;
    }

    setIsCreating(true);
    clearError();

    try {
      createTournament(tournamentName.trim(), selectedFormat, selectedPlayers);

      // Reset form
      setTournamentName('');
      setSelectedPlayers([]);

      if (onTournamentCreated) {
        onTournamentCreated();
      }
    } catch (err) {
      console.error('Error creating tournament:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const canCreate = tournamentName.trim() && selectedPlayers.length >= 2;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Crear Nuevo Torneo</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          {/* Tournament Name */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Detalles del Torneo</h3>
            <Input
              label="Nombre del Torneo"
              placeholder="Ingresa el nombre del torneo (ej: Copa Mundial FIFA 2024)"
              value={tournamentName}
              onValueChange={setTournamentName}
              size="lg"
              isRequired
            />
          </div>

          <Divider />

          {/* Format Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Formato del Torneo</h3>
            <FormatSelector
              selectedFormat={selectedFormat}
              onSelect={setSelectedFormat}
              playerCount={selectedPlayers.length}
            />
          </div>

          <Divider />

          {/* Player Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Seleccionar Jugadores</h3>
            <PlayerManager
              selectionMode={true}
              selectedPlayers={selectedPlayers}
              onPlayersSelected={setSelectedPlayers}
              minPlayers={2}
              maxPlayers={32}
            />
          </div>

          {/* Error Display */}
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

          {/* Create Button */}
          <div className="flex justify-end gap-3">
            <Button
              size="lg"
              color="primary"
              onPress={handleCreateTournament}
              isDisabled={!canCreate}
              isLoading={isCreating}
              className="min-w-32"
            >
              {isCreating ? 'Creando...' : 'Crear Torneo'}
            </Button>
          </div>

          {/* Tournament Preview */}
          {canCreate && (
            <Card className="bg-primary-50 border-primary-200">
              <CardBody className="p-4">
                <h4 className="font-semibold text-primary-700 mb-2">Tournament Preview</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {tournamentName}
                  </div>
                  <div>
                    <span className="font-medium">Format:</span> {selectedFormat === 'league' ? 'League Table' : selectedFormat === 'knockout' ? 'Knockout' : 'Hybrid'}
                  </div>
                  <div>
                    <span className="font-medium">Players:</span> {selectedPlayers.length}
                  </div>
                </div>

                <div className="mt-2">
                  <span className="font-medium">Estimated Matches:</span>{' '}
                  {selectedFormat === 'league'
                    ? (selectedPlayers.length * (selectedPlayers.length - 1)) / 2
                    : selectedFormat === 'knockout'
                    ? selectedPlayers.length - 1
                    : Math.ceil(selectedPlayers.length * 1.5)
                  }
                </div>
              </CardBody>
            </Card>
          )}
        </CardBody>
      </Card>
    </div>
  );
};