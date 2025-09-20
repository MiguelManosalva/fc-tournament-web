import { useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Tabs,
  Tab,
  Chip
} from '@heroui/react';
import { LeagueTable } from '../molecules/LeagueTable';
import { KnockoutBracket } from '../molecules/KnockoutBracket';
import { ChampionsView } from '../molecules/ChampionsView';
import { MatchCard } from '../atoms/MatchCard';
import { useTournamentStore } from '../../stores/tournamentStore';

export const TournamentView = () => {
  const {
    currentTournament,
    loadCurrentTournament,
    updateMatchResult,
    editMatchResult,
    startTournament
  } = useTournamentStore();

  useEffect(() => {
    loadCurrentTournament();
  }, [loadCurrentTournament]);

  if (!currentTournament) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardBody className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">No Hay Torneo Activo</h2>
            <p className="text-foreground-600 mb-4">
              Crea un nuevo torneo para comenzar a organizar tus partidos de FIFA.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  const handleStartTournament = () => {
    startTournament(currentTournament.id);
  };

  const handleMatchUpdate = (matchId: string, score1: number, score2: number) => {
    updateMatchResult(matchId, score1, score2);
  };

  const handleMatchEdit = (matchId: string, score1: number, score2: number) => {
    editMatchResult(matchId, score1, score2);
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

  const formatLabels = {
    league: 'Liga',
    knockout: 'Eliminación',
    champions: 'Champions'
  };

  const completedMatches = currentTournament.matches.filter(m => m.completed).length;
  const totalMatches = currentTournament.matches.length;
  const progressPercentage = totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Tournament Header */}
      <Card className="bg-gradient-to-r from-content1 to-content2 shadow-xl border-divider/50">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start w-full">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                {currentTournament.name}
              </h1>
              <div className="flex gap-3">
                <Chip
                  color="secondary"
                  variant="shadow"
                  startContent="🏟️"
                  className="font-semibold"
                >
                  {formatLabels[currentTournament.format]}
                </Chip>
                <Chip
                  color={statusColors[currentTournament.status]}
                  variant="shadow"
                  startContent={currentTournament.status === 'completed' ? '✅' : currentTournament.status === 'in_progress' ? '⚡' : '⚙️'}
                  className="font-semibold"
                >
                  {statusLabels[currentTournament.status]}
                </Chip>
              </div>
            </div>

            {currentTournament.status === 'setup' && (
              <Button
                color="primary"
                size="lg"
                variant="shadow"
                onPress={handleStartTournament}
                isDisabled={currentTournament.players.length < 2}
                className="bg-gradient-to-r from-primary to-secondary font-bold text-white transform hover:scale-105 transition-transform"
                startContent="🚀"
              >
                Iniciar Torneo
              </Button>
            )}
          </div>
        </CardHeader>

        <CardBody className="pt-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <div className="text-center p-3 sm:p-4 lg:p-5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 group cursor-pointer">
              <div className="text-2xl sm:text-3xl mb-2 group-hover:animate-bounce">👥</div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1">
                {currentTournament.players.length}
              </p>
              <p className="text-xs sm:text-sm text-foreground-600 font-medium">Jugadores</p>
            </div>
            <div className="text-center p-3 sm:p-4 lg:p-5 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/30 hover:border-secondary/50 transition-all duration-300 hover:scale-105 group cursor-pointer">
              <div className="text-2xl sm:text-3xl mb-2 group-hover:animate-bounce">⚽</div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary mb-1">
                {totalMatches}
              </p>
              <p className="text-xs sm:text-sm text-foreground-600 font-medium">Partidos Totales</p>
            </div>
            <div className="text-center p-3 sm:p-4 lg:p-5 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/30 hover:border-success/50 transition-all duration-300 hover:scale-105 group cursor-pointer">
              <div className="text-2xl sm:text-3xl mb-2 group-hover:animate-bounce">✅</div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-success mb-1">
                {completedMatches}
              </p>
              <p className="text-xs sm:text-sm text-foreground-600 font-medium">Completados</p>
            </div>
            <div className="text-center p-3 sm:p-4 lg:p-5 rounded-xl bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/30 hover:border-warning/50 transition-all duration-300 hover:scale-105 group cursor-pointer">
              <div className="text-2xl sm:text-3xl mb-2 group-hover:animate-bounce">📊</div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-warning mb-1">
                {Math.round(progressPercentage)}%
              </p>
              <p className="text-xs sm:text-sm text-foreground-600 font-medium">Progreso</p>
            </div>
          </div>

          {/* Progress Bar */}
          {currentTournament.status !== 'setup' && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground-700">Progreso del Torneo</span>
                <span className="text-sm font-bold text-primary">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-default-200 rounded-full h-4 shadow-inner">
                <div
                  className="bg-gradient-to-r from-primary via-secondary to-success h-4 rounded-full transition-all duration-700 ease-out shadow-lg"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Tournament Content */}
      {currentTournament.status === 'setup' ? (
        <Card>
          <CardBody className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">¡Listo para Empezar!</h3>
            <p className="text-foreground-600 mb-4">
              Tu torneo está configurado con {currentTournament.players.length} jugadores.
              Haz clic en "Iniciar Torneo" para generar los partidos y comenzar a jugar.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {currentTournament.players.map(player => (
                <Chip key={player.id} variant="flat" color="primary">
                  {player.name}
                </Chip>
              ))}
            </div>
          </CardBody>
        </Card>
      ) : (
        <Tabs aria-label="Tournament views" size="lg" color="primary">
          {/* Matches Tab */}
          <Tab key="matches" title="Partidos">
            <div className="space-y-4">
              {currentTournament.format === 'knockout' ? (
                <KnockoutBracket
                  tournament={currentTournament}
                  onUpdateResult={handleMatchUpdate}
                />
              ) : currentTournament.format === 'champions' ? (
                <ChampionsView
                  tournament={currentTournament}
                  onUpdateResult={handleMatchUpdate}
                  onEditResult={handleMatchEdit}
                />
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Todos los Partidos</h3>
                  {currentTournament.matches.length === 0 ? (
                    <Card>
                      <CardBody className="p-8 text-center">
                        <p className="text-foreground-600">Aún no se han generado partidos</p>
                      </CardBody>
                    </Card>
                  ) : (
                    <div className="grid gap-4">
                      {currentTournament.matches.map(match => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          onUpdateResult={(score1, score2) =>
                            handleMatchUpdate(match.id, score1, score2)
                          }
                          onEditResult={(score1, score2) =>
                            handleMatchEdit(match.id, score1, score2)
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Tab>

          {/* Standings Tab (for league format) */}
          {currentTournament.format === 'league' && (
            <Tab key="standings" title="Tabla">
              <LeagueTable tournament={currentTournament} />
            </Tab>
          )}

          {/* Players Tab */}
          <Tab key="players" title="Jugadores">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Jugadores del Torneo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentTournament.players.map(player => (
                  <Card key={player.id}>
                    <CardBody className="p-4 text-center">
                      <h4 className="font-semibold">{player.name}</h4>
                      <p className="text-sm text-foreground-600">
                        Se unió {player.createdAt.toLocaleDateString()}
                      </p>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </Tab>
        </Tabs>
      )}

      {/* Winner Announcement */}
      {currentTournament.winner && (
        <Card className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/20 dark:via-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-300/50 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/20 via-transparent to-yellow-200/20 animate-pulse"></div>
          <CardBody className="p-10 text-center relative z-10">
            <div className="relative mb-6">
              <div className="text-8xl mb-2 animate-bounce">🏆</div>
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-300/30 to-orange-300/30 rounded-full blur-lg"></div>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-700 via-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
              ¡Campeón del Torneo!
            </h2>
            <div className="bg-white/50 dark:bg-black/20 rounded-2xl p-6 mb-4 border border-yellow-200">
              <p className="text-2xl font-bold text-amber-800 dark:text-amber-200 mb-2">
                {currentTournament.winner.name}
              </p>
              <p className="text-lg text-yellow-700 dark:text-yellow-300">
                ¡Felicitaciones por tu victoria!
              </p>
            </div>
            {currentTournament.completedAt && (
              <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                🎯 Torneo completado el {currentTournament.completedAt.toLocaleDateString()}
              </p>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
};