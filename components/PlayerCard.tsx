import React from 'react'

import { Player } from '../utils/player'
import PlayerDetailCard from './PlayerDetailCard'
import PlayerEditCard from './PlayerEditCard'

interface PlayerCardProps {
  player: Player
  isExpanded: boolean
  onToggleExpand: (e: React.MouseEvent) => void
  onCurrentPlayerUpdate: (updatedPlayer: Player) => void
  onRemove: () => void
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isExpanded,
  onToggleExpand,
  onCurrentPlayerUpdate,
  onRemove,
}) => {
  const [isEditMode, setIsEditMode] = React.useState(false)

  const handleEditModeToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditMode((prev) => !prev)
  }

  const handleParticipationToggle = () => {
    player.isParticipatingInGame = !player.isParticipatingInGame
    onCurrentPlayerUpdate(player)
  }

  return (
    <div
      className={`border border-gray-300 rounded-lg p-4 cursor-pointer transition ${
        player.isParticipatingInGame
          ? 'bg-blue-100'
          : 'bg-white hover:bg-gray-50'
      }`}
      onClick={handleParticipationToggle} // カード全体で参加/非参加を切り替え
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <p className="text-lg font-bold">{player.name}</p>
          <p className="text-sm text-gray-500">({player.rating})</p>
          <p className="text-sm text-gray-500">
            希望ロール:
            {['TOP', 'JG', 'MID', 'ADC', 'SUP']
              .filter((_, index) => player.desiredRoles[index])
              .join(',')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleExpand}
            className="text-blue-500 hover:text-blue-700 transition"
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {isExpanded && !isEditMode && (
        <PlayerDetailCard
          currentPlayer={player}
          onEditModeToggle={handleEditModeToggle}
          onPlayerUpdate={onCurrentPlayerUpdate}
          onRemove={onRemove}
        />
      )}

      {isExpanded && isEditMode && (
        <PlayerEditCard
          currentPlayer={player}
          setEditablePlayer={(updatedPlayer) =>
            onCurrentPlayerUpdate(updatedPlayer)
          }
          onEditModeToggle={handleEditModeToggle}
        />
      )}
    </div>
  )
}

export default PlayerCard
