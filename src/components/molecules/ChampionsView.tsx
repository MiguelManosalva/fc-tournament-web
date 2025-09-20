import { Card, CardBody, CardHeader, Tabs, Tab, Chip } from '@heroui/react';
import type { Tournament, Match } from '../../types';
import { MatchCard } from '../atoms/MatchCard';
import { useTournamentStore } from '../../stores/tournamentStore';

interface ChampionsViewProps {
  tournament: Tournament;
  onUpdateResult?: (matchId: string, score1: number, score2: number) => void;
  onEditResult?: (matchId: string, score1: number, score2: number) => void;
}

export const ChampionsView = ({ tournament, onUpdateResult, onEditResult }: ChampionsViewProps) => {
  const { getLeagueStandings } = useTournamentStore();

  // Group matches (rounds 1, 2, 3)
  const groupMatches = tournament.matches.filter(match =>
    !match.player1.id.startsWith('tbd') && !match.player2.id.startsWith('tbd')
  );

  // Knockout matches (semifinals and final)
  const knockoutMatches = tournament.matches.filter(match =>
    match.player1.id.startsWith('tbd') || match.player2.id.startsWith('tbd')
  );

  // Group by round number for group stage (rounds 1, 2, 3)
  const rounds = groupMatches.reduce((acc, match) => {
    const roundKey = match.round || 1;
    if (!acc[roundKey]) {
      acc[roundKey] = [];
    }
    acc[roundKey].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  // Calculate overall standings for ALL players
  const overallStandings = getLeagueStandings(tournament);

  const getRoundName = (round: number, isKnockout: boolean, match?: Match) => {
    if (!isKnockout) {
      return `Ronda ${round}`;
    }

    // Determine knockout round names
    const totalRounds = Math.max(...knockoutMatches.map(m => m.round || 1));

    if (round === totalRounds) {
      // Check if this is the third place playoff or the final
      if (match && (match.player1.id.includes('loser') || match.player2.id.includes('loser'))) {
        return 'Partido por el 3er Lugar';
      }
      return 'Final';
    }
    if (round === totalRounds - 1) return 'Semifinales';
    return `Ronda ${round}`;
  };

  return (
    <Tabs
      aria-label="Champions League views"
      size="lg"
      color="primary"
      classNames={{
        tabList: "gap-2 sm:gap-4 w-full relative rounded-xl bg-background/60 backdrop-blur-md p-1 shadow-lg border border-divider/30",
        cursor: "bg-gradient-to-r from-primary to-secondary shadow-lg",
        tab: "px-3 py-2 sm:px-4 sm:py-3 font-semibold text-sm sm:text-base transition-all duration-300",
        tabContent: "group-data-[selected=true]:text-white"
      }}
    >
      {/* Group Stage Tab */}
      <Tab key="groups" title={<span className="flex items-center gap-2"><span>👥</span><span className="hidden sm:inline">Fase de Grupos</span><span className="sm:hidden">Grupos</span></span>}>
        <div className="space-y-6">
          {/* Overall Standings */}
          <Card className="bg-gradient-to-br from-content1 to-content2 shadow-xl border border-divider/30">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center w-full">
                <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  🏆 Clasificación General
                </h3>
                <Chip
                  size="sm"
                  color="primary"
                  variant="flat"
                >
                  {overallStandings.filter(s => s.gamesPlayed > 0).length} jugadores
                </Chip>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="bg-content1 rounded-lg p-4">
                {overallStandings.length > 0 ? (
                  <div className="space-y-2">
                    {overallStandings.map((standing, index) => (
                      <div
                        key={standing.player.id}
                        className={`flex justify-between items-center p-3 rounded-lg transition-all duration-300 ${
                          index < 4
                            ? 'bg-gradient-to-r from-success/20 to-success/10 border border-success/30'
                            : 'bg-content2 hover:bg-content1'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-lg w-8 h-8 rounded-full flex items-center justify-center ${
                              index < 4 ? 'bg-success text-success-foreground' : 'bg-default-200 text-foreground'
                            }`}>
                              {index + 1}
                            </span>
                            <span className="font-medium text-lg">
                              {standing.player.name}
                            </span>
                          </div>
                          {index < 4 && (
                            <Chip size="sm" color="success" variant="flat" startContent="🏆">
                              Clasifica
                            </Chip>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-right">
                          <div>
                            <div className="font-bold text-lg text-primary">
                              {standing.points} pts
                            </div>
                            <div className="text-xs text-foreground-500">
                              {standing.wins}W {standing.draws}E {standing.losses}D
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-secondary">
                              {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
                            </div>
                            <div className="text-xs text-foreground-500">
                              {standing.goalsFor}-{standing.goalsAgainst}
                            </div>
                          </div>
                          <div className="text-sm text-foreground-600">
                            {standing.gamesPlayed}/3 PJ
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-foreground-500 py-4">
                    Completa los partidos para ver la clasificación
                  </p>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Rounds */}
          {Object.entries(rounds).map(([round, matches]) => {
            const roundNum = parseInt(round);
            const completedMatches = matches.filter(m => m.completed).length;

            return (
              <Card key={round} className="overflow-visible shadow-lg border border-divider/30">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center w-full">
                    <h3 className="text-xl font-bold">
                      {getRoundName(roundNum, false)}
                    </h3>
                    <Chip
                      size="sm"
                      color={completedMatches === matches.length ? "success" : "primary"}
                      variant="flat"
                    >
                      {completedMatches}/{matches.length} completados
                    </Chip>
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <div className="space-y-3">
                    {matches.map(match => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        onUpdateResult={(score1, score2) =>
                          onUpdateResult?.(match.id, score1, score2)
                        }
                        onEditResult={(score1, score2) =>
                          onEditResult?.(match.id, score1, score2)
                        }
                        showRound={false}
                        compact
                      />
                    ))}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </Tab>

      {/* Knockout Stage Tab */}
      <Tab key="knockout" title={<span className="flex items-center gap-2"><span>🏆</span><span className="hidden sm:inline">Fase Eliminatoria</span><span className="sm:hidden">Finales</span></span>}>
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Fase Eliminatoria</h3>
          {knockoutMatches.length === 0 ? (
            <Card>
              <CardBody className="p-8 text-center">
                <p className="text-foreground-600">
                  Los partidos eliminatorios se generarán automáticamente cuando termine la fase de grupos
                </p>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-warning/10 to-warning/5 p-4 rounded-xl border border-warning/30">
                <p className="text-sm text-foreground-700 font-medium">
                  <strong>Sistema de eliminatorias:</strong> Los 4 mejores clasificados avanzan donde:
                  1° vs 4° y 2° vs 3° en semifinales, luego la gran final.
                </p>
              </div>

              {/* Group by round for knockout phase */}
              {Object.entries(
                knockoutMatches.reduce((acc, match) => {
                  const round = match.round || 1;
                  if (!acc[round]) acc[round] = [];
                  acc[round].push(match);
                  return acc;
                }, {} as Record<number, Match[]>)
              ).map(([round, matches]) => (
                <div key={round}>
                  {matches.map((match, index) => (
                    <div key={match.id} className="mb-6">
                      <h4 className="text-lg font-semibold mb-3">
                        {getRoundName(parseInt(round), true, match)}
                      </h4>
                      <div className="grid gap-4">
                        <MatchCard
                          key={match.id}
                          match={match}
                          onUpdateResult={(score1, score2) =>
                            onUpdateResult?.(match.id, score1, score2)
                          }
                          onEditResult={(score1, score2) =>
                            onEditResult?.(match.id, score1, score2)
                          }
                          showRound={false}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </Tab>
    </Tabs>
  );
};