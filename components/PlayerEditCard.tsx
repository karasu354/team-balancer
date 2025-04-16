import React from 'react'

import { Player } from '../utils/player'

interface PlayerEditCardProps {
  editablePlayer: Player | null
  setEditablePlayer: (player: Player) => void
  onEdit: (e: React.MouseEvent) => void
}

const PlayerEditCard: React.FC<PlayerEditCardProps> = ({
  editablePlayer,
  setEditablePlayer,
  onEdit,
}) => {
  const handleInputChange = (field: keyof Player, value: any) => {
    if (editablePlayer) {
      const updatedPlayer = new Player(
        editablePlayer.name,
        editablePlayer.tier,
        editablePlayer.rank
      )
      updatedPlayer.desiredRoles = editablePlayer.desiredRoles
      updatedPlayer.isParticipatingInGame = editablePlayer.isParticipatingInGame
      updatedPlayer.displayRank = editablePlayer.displayRank
      updatedPlayer.rating = editablePlayer.rating
      updatedPlayer.isRoleFixed = editablePlayer.isRoleFixed
      setEditablePlayer(updatedPlayer)
    }
  }

  const handleRoleToggle = (roleIndex: number) => {
    if (editablePlayer) {
      const updatedRoles = [...editablePlayer.desiredRoles]
      updatedRoles[roleIndex] = !updatedRoles[roleIndex]
      handleInputChange('desiredRoles', updatedRoles)
    }
  }

  return (
    <div className="mt-4 border-t pt-4">
      <label className="flex items-center space-x-1">
        <input
          type="checkbox"
          checked={editablePlayer?.isRoleFixed || false}
          onChange={(e) => handleInputChange('isRoleFixed', e.target.checked)}
        />
        <span className="text-sm">希望ロール固定</span>
      </label>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          保存
        </button>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          キャンセル
        </button>
      </div>
    </div>
  )
}

export default PlayerEditCard
