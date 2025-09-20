import { Card, CardBody, CardHeader, Button, Chip, Avatar, AvatarGroup } from '@heroui/react';
import type { Tournament, TournamentFormat } from '../../types';

interface TournamentCardProps {
  tournament: Tournament;
  onSelect?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  selectable?: boolean;
}

const formatLabels: Record<TournamentFormat, string> = {
  league: 'Liga',
  knockout: 'Eliminación',
  champions: 'Champions'
};

const statusColors = {
  setup: 'default' as const,
  in_progress: 'primary' as const,
  completed: 'success' as const
};

const statusLabels = {
  setup: 'Configuración',
  in_progress: 'En Progreso',
  completed: 'Completado'
};

export const TournamentCard = ({
  tournament,
  onSelect,
  onDelete,
  onEdit,
  selectable = false
}: TournamentCardProps) => {
  const completedMatches = tournament.matches.filter(m => m.completed).length;
  const totalMatches = tournament.matches.length;
  const progressPercentage = totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0;

  return (
    <Card
      className={`w-full shadow-lg border border-divider/50 bg-gradient-to-br from-content1 to-content2 ${
        selectable ? 'cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300 hover:border-primary/30' : ''
      }`}
      isPressable={selectable}
      onPress={onSelect}
    >
      <CardHeader className="flex justify-between items-start p-5 pb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🏆</span>
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {tournament.name}
            </h3>
          </div>
          <div className="flex gap-2 mt-2">
            <Chip size="sm" variant="shadow" color="secondary" startContent="🏟️">
              {formatLabels[tournament.format]}
            </Chip>
            <Chip
              size="sm"
              variant="shadow"
              color={statusColors[tournament.status]}
              startContent={tournament.status === 'completed' ? '✅' : tournament.status === 'in_progress' ? '⚡' : '⚙️'}
            >
              {statusLabels[tournament.status]}
            </Chip>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex gap-1">
            {onEdit && (
              <Button
                size="sm"
                variant="light"
                color="primary"
                onPress={onEdit}
                className="min-w-0 px-2"
              >
                Editar
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="light"
                color="danger"
                onPress={onDelete}
                className="min-w-0 px-2"
              >
                Eliminar
              </Button>
            )}
          </div>
        )}
      </CardHeader>

      <CardBody className="pt-0 p-5">
        {/* Players */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">👥</span>
            <p className="text-sm font-semibold text-foreground-700">
              Jugadores ({tournament.players.length})
            </p>
          </div>
          <AvatarGroup max={4} size="sm" className="hover:scale-105 transition-transform">
            {tournament.players.map(player => (
              <Avatar
                key={player.id}
                name={player.name}
                src={player.avatar}
                size="sm"
                className="border-2 border-background shadow-md"
              />
            ))}
          </AvatarGroup>
        </div>

        {/* Progress */}
        {tournament.status !== 'setup' && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1">
                <span className="text-lg">📈</span>
                <p className="text-sm font-semibold text-foreground-700">Progreso</p>
              </div>
              <span className="text-xs font-medium text-foreground-600 bg-content1 px-2 py-1 rounded-full">
                {completedMatches}/{totalMatches} partidos
              </span>
            </div>
            <div className="w-full bg-default-200 rounded-full h-3 shadow-inner">
              <div
                className="bg-gradient-to-r from-primary to-success h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Winner */}
        {tournament.winner && (
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl border border-amber-200/50 mb-4">
            <div className="relative">
              <Avatar
                name={tournament.winner.name}
                src={tournament.winner.avatar}
                size="sm"
                className="border-2 border-amber-300 shadow-lg"
              />
              <div className="absolute -top-1 -right-1 text-lg">👑</div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-lg">🏆</span>
                <p className="text-sm font-bold text-amber-700 dark:text-amber-300">Campeón</p>
              </div>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">{tournament.winner.name}</p>
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="mt-4 p-3 bg-content1 rounded-lg border border-divider/30">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-sm">📅</span>
            <p className="text-xs font-medium text-foreground-600">
              Creado: {tournament.createdAt.toLocaleDateString()}
            </p>
          </div>
          {tournament.completedAt && (
            <div className="flex items-center gap-1">
              <span className="text-sm">✅</span>
              <p className="text-xs font-medium text-success-600">
                Completado: {tournament.completedAt.toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};