import { Card, CardBody } from '@heroui/react';
import type { TournamentFormat } from '../../types';

interface FormatOption {
  format: TournamentFormat;
  title: string;
  description: string;
  icon: string;
  recommended?: number;
  pros: string[];
  cons: string[];
}

const formatOptions: FormatOption[] = [
  {
    format: 'league',
    title: 'Tabla de Liga',
    description: 'Formato de todos contra todos (round-robin)',
    icon: '📊',
    recommended: 8,
    pros: ['Más justo', 'Todos juegan la misma cantidad', 'El mejor jugador usualmente gana'],
    cons: ['Muchos partidos', 'Toma más tiempo', 'Puede ser menos emocionante']
  },
  {
    format: 'knockout',
    title: 'Torneo de Eliminación',
    description: 'Bracket de eliminación directa hasta la final',
    icon: '🏆',
    recommended: 16,
    pros: ['Rápido y emocionante', 'Menos partidos', 'Alta tensión en cada juego'],
    cons: ['Un mal partido te elimina', 'Menos justo', 'Algunos jugadores juegan poco']
  },
  {
    format: 'champions',
    title: 'Champions League',
    description: 'Fase de grupos (todos juegan igual cantidad) + semifinales 1°vs4° y 2°vs3°',
    icon: '🏆',
    recommended: 8,
    pros: ['Todos juegan igual cantidad', 'Sistema justo', 'Emociones de Champions', 'Top 4 avanzan'],
    cons: ['Requiere mínimo 4 jugadores', 'Más partidos que eliminación', 'Formato estructurado']
  }
];

interface FormatSelectorProps {
  selectedFormat?: TournamentFormat;
  onSelect: (format: TournamentFormat) => void;
  playerCount: number;
}

export const FormatSelector = ({
  selectedFormat,
  onSelect,
  playerCount
}: FormatSelectorProps) => {
  const getMatchCount = (format: TournamentFormat): number => {
    switch (format) {
      case 'league':
        return (playerCount * (playerCount - 1)) / 2;
      case 'knockout':
        return playerCount - 1;
      case 'champions':
        // Champions: fase de grupos + semifinales + final + 3er lugar
        if (playerCount < 4) return 0;

        const isOddPlayers = playerCount % 2 === 1;
        let groupMatches;

        if (isOddPlayers) {
          // Para números impares: cada jugador tiene 1 bye, resto juega
          groupMatches = Math.floor(playerCount / 2) * playerCount; // rounds = playerCount, matches per round = playerCount/2
        } else {
          // Para números pares: 3 rondas normales
          groupMatches = Math.floor(playerCount / 2) * 3; // 3 rondas, playerCount/2 partidos por ronda
        }

        const knockoutMatches = 4; // 2 semifinales + 1 final + 1 tercer lugar
        return groupMatches + knockoutMatches;
      default:
        return 0;
    }
  };

  const getEstimatedTime = (matchCount: number): string => {
    const totalMinutes = matchCount * 6; // 6 minutos por partido
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const isRecommended = (option: FormatOption): boolean => {
    if (!option.recommended) return false;
    return playerCount <= option.recommended;
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {formatOptions.map((option) => {
        const isSelected = selectedFormat === option.format;
        const matchCount = getMatchCount(option.format);
        const recommended = isRecommended(option);

        return (
          <Card
            key={option.format}
            className={`cursor-pointer transition-all duration-200 ${
              isSelected
                ? 'ring-2 ring-primary border-primary bg-primary-50'
                : 'hover:shadow-lg hover:scale-105'
            }`}
            isPressable
            onPress={() => onSelect(option.format)}
          >
            <CardBody className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    {option.title}
                    {recommended && (
                      <span className="text-xs bg-success text-success-foreground px-2 py-0.5 rounded-full">
                        Recomendado
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-foreground-600">{option.description}</p>
                </div>
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚽</span>
                  <p className="text-sm font-medium text-foreground-700">
                    Partidos estimados: <span className="font-bold text-primary">{matchCount}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">⏱️</span>
                  <p className="text-sm font-medium text-foreground-700">
                    Tiempo estimado: <span className="font-bold text-secondary">{getEstimatedTime(matchCount)}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-success-600 mb-1">Ventajas:</p>
                  <ul className="text-xs text-foreground-600 space-y-0.5">
                    {option.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-success-500 text-xs">✓</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-medium text-danger-600 mb-1">Desventajas:</p>
                  <ul className="text-xs text-foreground-600 space-y-0.5">
                    {option.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-danger-500 text-xs">×</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {isSelected && (
                <div className="mt-3 pt-3 border-t border-primary-200">
                  <div className="w-full py-2 px-3 text-sm font-medium text-primary bg-primary/10 rounded-lg text-center">
                    Seleccionado
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};