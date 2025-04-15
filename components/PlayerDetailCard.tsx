import React from 'react'

import { Player } from '../utils/player'
import PlayerEditCard from './PlayerEditCard'

interface PlayerDetailCardProps {
  player: Player
  isEditing: boolean
  onEditToggle: () => void
  onSaveEdit: (updatedPlayer: Player) => void
  onRoleChange: (roleIndex: number) => void
  onRemove: () => void
  editablePlayer: Player | null
  setEditablePlayer: (player: Player) => void
}

const PlayerDetailCard: React.FC<PlayerDetailCardProps> = ({
  player,
  isEditing,
  onEditToggle,
  onSaveEdit,
  onRoleChange,
  onRemove,
  editablePlayer,
  setEditablePlayer,
}) => {
  return (
    <div className="mt-4 border-t pt-4">
      {isEditing ? (
        <PlayerEditCard
          editablePlayer={editablePlayer}
          setEditablePlayer={setEditablePlayer}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onEditToggle}
        />
      ) : (
        <div className="space-y-2">
          <p>ティア: {player.tier}</p>
          <p>レーティング: {player.rating}</p>
          <div className="flex space-x-2">
            {['TOP', 'JG', 'MID', 'ADC', 'SUP'].map((role, index) => (
              <label key={role} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={player.desiredRoles[index]}
                  disabled
                />
                <span className="text-xs">{role}</span>
              </label>
            ))}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onEditToggle}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              編集
            </button>
            <button
              onClick={onRemove}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              削除
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlayerDetailCard
