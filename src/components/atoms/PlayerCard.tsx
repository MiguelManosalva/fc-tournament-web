import { Card, CardBody, Button, Avatar } from '@heroui/react';
import type { Player } from '../../types';

interface PlayerCardProps {
  player: Player;
  onEdit?: () => void;
  onDelete?: () => void;
  selected?: boolean;
  onSelect?: () => void;
  selectable?: boolean;
  compact?: boolean;
}

export const PlayerCard = ({
  player,
  onEdit,
  onDelete,
  selected = false,
  onSelect,
  selectable = false,
  compact = false
}: PlayerCardProps) => {
  const handleClick = () => {
    if (selectable && onSelect) {
      onSelect();
    }
  };

  return (
    <Card
      className={`w-full ${selectable ? 'cursor-pointer hover:scale-105 transition-transform' : ''} ${
        selected ? 'ring-2 ring-primary border-primary' : ''
      } ${compact ? 'p-1' : 'p-2'}`}
      isPressable={selectable}
      onPress={handleClick}
    >
      <CardBody className={`flex-row items-center gap-3 ${compact ? 'p-2' : 'p-4'}`}>
        <Avatar
          name={player.name}
          src={player.avatar}
          size={compact ? 'sm' : 'md'}
          className="flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-foreground truncate ${compact ? 'text-sm' : 'text-base'}`}>
            {player.name}
          </h4>
          {!compact && (
            <p className="text-xs text-foreground-500">
              Se unió el {player.createdAt.toLocaleDateString()}
            </p>
          )}
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

        {selectable && (
          <div className="flex-shrink-0">
            <div className={`w-4 h-4 rounded-full border-2 ${
              selected ? 'bg-primary border-primary' : 'border-default-300'
            }`}>
              {selected && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};