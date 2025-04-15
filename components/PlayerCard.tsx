import React, { useState } from 'react'

import { Player } from '../utils/player'
import PlayerDetailCard from './PlayerDetailCard'

interface PlayerCardProps {
  player: Player | null
  onToggleParticipation?: (isParticipating: boolean) => void
  onToggleRole?: (roleIndex: number) => void
  onRemove?: () => void
  onEdit?: (updatedPlayer: Player) => void
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onToggleParticipation,
  onToggleRole,
  onRemove,
  onEdit,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editablePlayer, setEditablePlayer] = useState<Player | null>(player)

  if (!player) {
    return <div className="flex-1 text-center text-gray-400">No Player</div>
  }

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    setEditablePlayer(player)
  }

  const handleSaveEdit = (updatedPlayer: Player) => {
    if (onEdit) {
      onEdit(updatedPlayer)
    }
    setIsEditing(false)
  }

  const handleParticipationToggle = () => {
    if (onToggleParticipation) {
      onToggleParticipation(!player.isParticipatingInGame)
    }
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold">{player.name}</p>
          <p className="text-sm text-gray-500">({player.displayRank})</p>
          <p className="text-sm text-gray-500">
            希望ロール:{' '}
            {['TOP', 'JG', 'MID', 'ADC', 'SUP']
              .filter((_, index) => player.desiredRoles[index])
              .join(', ')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-1">
            <input
              type="checkbox"
              checked={player.isParticipatingInGame}
              onChange={handleParticipationToggle}
            />
            <span className="text-sm">参加</span>
          </label>
          <button
            onClick={handleToggleExpand}
            className="text-blue-500 hover:text-blue-700 transition"
          >
            {isExpanded ? '▲ 閉じる' : '▼ 詳細'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <PlayerDetailCard
          player={player}
          isEditing={isEditing}
          onEditToggle={handleEditToggle}
          onSaveEdit={handleSaveEdit}
          onRoleChange={onToggleRole!}
          onRemove={onRemove!}
          editablePlayer={editablePlayer}
          setEditablePlayer={setEditablePlayer}
        />
      )}
    </div>
  )
}

export default PlayerCard
