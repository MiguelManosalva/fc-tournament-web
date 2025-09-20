import { Card, CardBody, CardHeader } from '@heroui/react';
import type { Tournament, Match } from '../../types';
import { MatchCard } from '../atoms/MatchCard';

interface KnockoutBracketProps {
  tournament: Tournament;
  onUpdateResult?: (matchId: string, score1: number, score2: number) => void;
}

export const KnockoutBracket = ({ tournament, onUpdateResult }: KnockoutBracketProps) => {
  // Group matches by round
  const matchesByRound = tournament.matches.reduce((acc, match) => {
    const round = match.round || 1;
    if (!acc[round]) {
      acc[round] = [];
    }
    acc[round].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  const rounds = Object.keys(matchesByRound)
    .map(Number)
    .sort((a, b) => a - b);

  const getRoundName = (round: number, totalRounds: number) => {
    const remainingRounds = totalRounds - round + 1;

    if (remainingRounds === 1) return 'Final';
    if (remainingRounds === 2) return 'Semifinal';
    if (remainingRounds === 3) return 'Cuartos de Final';
    if (remainingRounds === 4) return 'Octavos de Final';
    return `Ronda ${round}`;
  };

  const handleMatchUpdate = (matchId: string) => (score1: number, score2: number) => {
    if (onUpdateResult) {
      onUpdateResult(matchId, score1, score2);
    }
  };

  if (rounds.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-foreground-600">Tournament bracket will appear here</p>
        <p className="text-sm text-foreground-500">Start the tournament to generate matches</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-center">Tournament Bracket</h3>

      <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto">
        {rounds.map((round) => {
          const roundMatches = matchesByRound[round];
          const roundName = getRoundName(round, rounds.length);

          return (
            <Card key={round} className="flex-1 min-w-80">
              <CardHeader className="pb-2">
                <h4 className="text-lg font-semibold text-center w-full">
                  {roundName}
                </h4>
              </CardHeader>
              <CardBody className="space-y-3">
                {roundMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onUpdateResult={handleMatchUpdate(match.id)}
                    showRound={false}
                    compact={true}
                  />
                ))}
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Tournament progression info */}
      <Card className="bg-primary-50">
        <CardBody className="p-4">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Tournament Progress</span>
            <span>
              {tournament.matches.filter(m => m.completed).length} / {tournament.matches.filter(m => m.player1.id !== 'tbd' && m.player2.id !== 'tbd').length} matches completed
            </span>
          </div>

          <div className="w-full bg-default-200 rounded-full h-2 mt-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  tournament.matches.filter(m => m.player1.id !== 'tbd' && m.player2.id !== 'tbd').length > 0
                    ? (tournament.matches.filter(m => m.completed).length /
                       tournament.matches.filter(m => m.player1.id !== 'tbd' && m.player2.id !== 'tbd').length) * 100
                    : 0
                }%`
              }}
            />
          </div>
        </CardBody>
      </Card>

      {/* Winner announcement */}
      {tournament.winner && (
        <Card className="bg-success-50 border-success-200">
          <CardBody className="p-6 text-center">
            <h3 className="text-2xl font-bold text-success-700 mb-2">
              🏆 Tournament Champion! 🏆
            </h3>
            <p className="text-lg text-success-600">
              Congratulations to <strong>{tournament.winner.name}</strong>!
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
};