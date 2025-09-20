import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Chip
} from '@heroui/react';
import type { Tournament, LeagueStanding } from '../../types';
import { useTournamentStore } from '../../stores/tournamentStore';

interface LeagueTableProps {
  tournament: Tournament;
}

export const LeagueTable = ({ tournament }: LeagueTableProps) => {
  const { getLeagueStandings } = useTournamentStore();
  const standings = getLeagueStandings(tournament);

  const columns = [
    { key: 'position', label: 'Pos' },
    { key: 'player', label: 'Jugador' },
    { key: 'played', label: 'P' },
    { key: 'wins', label: 'W' },
    { key: 'draws', label: 'D' },
    { key: 'losses', label: 'L' },
    { key: 'goalsFor', label: 'GF' },
    { key: 'goalsAgainst', label: 'GA' },
    { key: 'goalDifference', label: 'GD' },
    { key: 'points', label: 'Pts' }
  ];

  const renderCell = (standing: LeagueStanding, columnKey: string, index: number) => {
    switch (columnKey) {
      case 'position':
        return (
          <div className="flex items-center gap-2">
            <span className="font-semibold">{index + 1}</span>
            {index === 0 && <span className="text-yellow-500">👑</span>}
          </div>
        );

      case 'player':
        return (
          <div className="flex items-center gap-2">
            <Avatar
              name={standing.player.name}
              src={standing.player.avatar}
              size="sm"
            />
            <span className="font-medium">{standing.player.name}</span>
          </div>
        );

      case 'played':
        return standing.gamesPlayed;

      case 'wins':
        return standing.wins;

      case 'draws':
        return standing.draws;

      case 'losses':
        return standing.losses;

      case 'goalsFor':
        return standing.goalsFor;

      case 'goalsAgainst':
        return standing.goalsAgainst;

      case 'goalDifference':
        return (
          <span className={
            standing.goalDifference > 0 ? 'text-success' :
            standing.goalDifference < 0 ? 'text-danger' :
            'text-default'
          }>
            {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
          </span>
        );

      case 'points':
        return (
          <Chip
            size="sm"
            color={index === 0 ? 'success' : index < 3 ? 'primary' : 'default'}
            variant="flat"
          >
            {standing.points}
          </Chip>
        );

      default:
        return null;
    }
  };

  if (standings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-foreground-600">Aún no se han jugado partidos</p>
        <p className="text-sm text-foreground-500">Los resultados aparecerán aquí una vez que se completen los partidos</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Tabla de Liga</h3>
        <div className="text-sm text-foreground-600">
          {tournament.matches.filter(m => m.completed).length} / {tournament.matches.length} partidos jugados
        </div>
      </div>

      <Table
        aria-label="League standings table"
        classNames={{
          wrapper: 'shadow-none border border-divider',
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              className={column.key === 'player' ? 'text-left' : 'text-center'}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={standings}>
          {(standing) => {
            const index = standings.indexOf(standing);
            return (
              <TableRow
                key={standing.player.id}
                className={`${
                  index === 0 ? 'bg-success-50' :
                  index < 3 ? 'bg-primary-50' :
                  ''
                }`}
              >
                {(columnKey) => (
                  <TableCell
                    className={columnKey === 'player' ? 'text-left' : 'text-center'}
                  >
                    {renderCell(standing, columnKey as string, index)}
                  </TableCell>
                )}
              </TableRow>
            );
          }}
        </TableBody>
      </Table>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-foreground-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-success-200 rounded"></div>
          <span>Campeón</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-primary-200 rounded"></div>
          <span>Top 3</span>
        </div>
      </div>
    </div>
  );
};