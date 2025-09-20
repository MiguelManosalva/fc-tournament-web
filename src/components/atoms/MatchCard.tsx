import {
  Card,
  CardBody,
  Avatar,
  Button,
  Input,
  Chip
} from '@heroui/react';
import { useState } from 'react';
import type { Match } from '../../types';

interface MatchCardProps {
  match: Match;
  onUpdateResult?: (score1: number, score2: number) => void;
  onEditResult?: (score1: number, score2: number) => void;
  showRound?: boolean;
  compact?: boolean;
  editable?: boolean;
}

export const MatchCard = ({
  match,
  onUpdateResult,
  onEditResult,
  showRound = true,
  compact = false,
  editable = true
}: MatchCardProps) => {
  const [score1, setScore1] = useState(match.score1?.toString() || '');
  const [score2, setScore2] = useState(match.score2?.toString() || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveResult = () => {
    const s1 = parseInt(score1) || 0;
    const s2 = parseInt(score2) || 0;

    if (match.completed && onEditResult) {
      onEditResult(s1, s2);
    } else if (!match.completed && onUpdateResult) {
      onUpdateResult(s1, s2);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setScore1(match.score1?.toString() || '');
    setScore2(match.score2?.toString() || '');
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setScore1(match.score1?.toString() || '');
    setScore2(match.score2?.toString() || '');
    setIsEditing(true);
  };

  const isTBD = match.player1.id === 'tbd' || match.player2.id === 'tbd';

  return (
    <Card
      className={`w-full transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] ${
        match.completed
          ? 'bg-gradient-to-r from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 border-success-200'
          : isTBD
          ? 'bg-gradient-to-r from-default-100 to-default-200 opacity-75'
          : 'bg-gradient-to-r from-content1 to-content2 border-primary/20'
      }`}
    >
      <CardBody className={`${compact ? 'p-3' : 'p-4'}`}>
        {/* Round info */}
        {showRound && match.round && (
          <div className="flex justify-between items-center mb-4">
            <Chip size="sm" variant="shadow" color="secondary" startContent="🏟️">
              Ronda {match.round}
            </Chip>
            {match.matchNumber && (
              <Chip size="sm" variant="flat" color="default">
                #{match.matchNumber}
              </Chip>
            )}
          </div>
        )}

        {/* Players and scores */}
        <div className="flex items-center justify-between">
          {/* Player 1 */}
          <div className="flex items-center gap-2 flex-1">
            <Avatar
              name={match.player1.name}
              src={match.player1.avatar}
              size={compact ? 'sm' : 'md'}
              className={isTBD ? 'opacity-50' : ''}
            />
            <div className="min-w-0 flex-1">
              <p className={`font-medium truncate ${
                isTBD ? 'text-foreground-500' : 'text-foreground'
              } ${compact ? 'text-sm' : ''}`}>
                {match.player1.name}
              </p>
              {match.winner?.id === match.player1.id && (
                <div className="flex items-center gap-1">
                  <span className="text-lg">👑</span>
                  <span className="text-xs text-success-600 font-bold">Ganador</span>
                </div>
              )}
            </div>
          </div>

          {/* Score section */}
          <div className="flex items-center gap-3 mx-6">
            {!isTBD && (
              <>
                {isEditing && editable ? (
                  <div className="flex items-center gap-3 bg-content1 p-3 rounded-xl border border-primary/20">
                    <Input
                      size="sm"
                      type="number"
                      min="0"
                      max="99"
                      value={score1}
                      onValueChange={setScore1}
                      className="w-16"
                      classNames={{
                        input: "text-center font-bold",
                        inputWrapper: "border-primary/30"
                      }}
                    />
                    <span className="text-xl font-bold text-primary">VS</span>
                    <Input
                      size="sm"
                      type="number"
                      min="0"
                      max="99"
                      value={score2}
                      onValueChange={setScore2}
                      className="w-16"
                      classNames={{
                        input: "text-center font-bold",
                        inputWrapper: "border-primary/30"
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-4 bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-3 rounded-xl border border-primary/20">
                    <div className={`text-2xl font-bold transition-colors ${
                      match.winner?.id === match.player1.id ? 'text-success' : 'text-foreground'
                    }`}>
                      {match.score1 ?? '?'}
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-foreground-500 font-medium">VS</span>
                      <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                    </div>
                    <div className={`text-2xl font-bold transition-colors ${
                      match.winner?.id === match.player2.id ? 'text-success' : 'text-foreground'
                    }`}>
                      {match.score2 ?? '?'}
                    </div>
                  </div>
                )}
              </>
            )}

            {isTBD && (
              <div className="flex items-center gap-2 px-6 py-3 bg-default-100 rounded-xl">
                <span className="text-lg">⏳</span>
                <span className="text-sm text-foreground-500 font-medium">
                  Por Definir
                </span>
              </div>
            )}
          </div>

          {/* Player 2 */}
          <div className="flex items-center gap-2 flex-1 flex-row-reverse">
            <Avatar
              name={match.player2.name}
              src={match.player2.avatar}
              size={compact ? 'sm' : 'md'}
              className={isTBD ? 'opacity-50' : ''}
            />
            <div className="min-w-0 flex-1 text-right">
              <p className={`font-medium truncate ${
                isTBD ? 'text-foreground-500' : 'text-foreground'
              } ${compact ? 'text-sm' : ''}`}>
                {match.player2.name}
              </p>
              {match.winner?.id === match.player2.id && (
                <div className="flex items-center gap-1">
                  <span className="text-lg">👑</span>
                  <span className="text-xs text-success-600 font-bold">Ganador</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {!isTBD && editable && (
          <div className="flex justify-center gap-3 mt-5">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  color="primary"
                  variant="shadow"
                  onPress={handleSaveResult}
                  isDisabled={!score1 || !score2}
                  startContent="💾"
                  className="font-semibold"
                >
                  Guardar
                </Button>
                <Button
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={handleCancel}
                  startContent="❌"
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                {!match.completed ? (
                  <Button
                    size="sm"
                    variant="shadow"
                    color="primary"
                    onPress={handleStartEdit}
                    startContent="⚽"
                    className="font-semibold"
                  >
                    Ingresar Resultado
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="flat"
                      color="success"
                      isDisabled
                      startContent="✅"
                      className="font-semibold"
                    >
                      Resultado Registrado
                    </Button>
                    {onEditResult && (
                      <Button
                        size="sm"
                        variant="bordered"
                        color="warning"
                        onPress={handleStartEdit}
                        startContent="✏️"
                        className="font-semibold"
                      >
                        Editar
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Match info */}
        {match.playedAt && (
          <div className="flex items-center justify-center gap-1 mt-3 text-xs text-foreground-500">
            <span>📅</span>
            <span>Jugado el {match.playedAt.toLocaleDateString()}</span>
          </div>
        )}
      </CardBody>
    </Card>
  );
};