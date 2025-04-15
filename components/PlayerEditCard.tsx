import React from 'react'

import { Player } from '../utils/player'

interface PlayerEditCardProps {
  editablePlayer: Player | null
  setEditablePlayer: (player: Player) => void
  onSaveEdit: (updatedPlayer: Player) => void
  onCancelEdit: () => void
}

const PlayerEditCard: React.FC<PlayerEditCardProps> = ({
  editablePlayer,
  setEditablePlayer,
  onSaveEdit,
  onCancelEdit,
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
    <div className="space-y-2">
      <input
        type="text"
        value={editablePlayer?.name || ''}
        onChange={(e) => handleInputChange('name', e.target.value)}
        className="p-2 border border-gray-300 rounded w-full"
        placeholder="プレイヤー名を入力"
      />
      <select
        value={editablePlayer?.tier || ''}
        onChange={(e) =>
          handleInputChange('tier', e.target.value as Player['tier'])
        }
        className="p-2 border border-gray-300 rounded w-full"
      >
        {Object.values(Player.tierEnum).map((tier) => (
          <option key={tier} value={tier}>
            {tier}
          </option>
        ))}
      </select>
      <select
        value={editablePlayer?.rank || ''}
        onChange={(e) =>
          handleInputChange('rank', e.target.value as Player['rank'])
        }
        className="p-2 border border-gray-300 rounded w-full"
      >
        {Object.values(Player.rankEnum).map((rank) => (
          <option key={rank} value={rank}>
            {rank}
          </option>
        ))}
      </select>
      <div className="flex space-x-2">
        {['TOP', 'JG', 'MID', 'ADC', 'SUP'].map((role, index) => (
          <label key={role} className="flex items-center space-x-1">
            <input
              type="checkbox"
              checked={editablePlayer?.desiredRoles[index] || false}
              onChange={() => handleRoleToggle(index)}
            />
            <span className="text-xs">{role}</span>
          </label>
        ))}
      </div>
      <label className="flex items-center space-x-1">
        <input
          type="checkbox"
          checked={editablePlayer?.isRoleFixed || false}
          onChange={(e) => handleInputChange('isRoleFixed', e.target.checked)}
        />
        <span className="text-sm">希望ロール固定</span>
      </label>
      <div className="flex space-x-2">
        <button
          onClick={() => onSaveEdit(editablePlayer!)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          保存
        </button>
        <button
          onClick={onCancelEdit}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          キャンセル
        </button>
      </div>
    </div>
  )
}

export default PlayerEditCard
