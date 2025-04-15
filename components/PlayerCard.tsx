import React, { useState } from 'react'

import { Player } from '../utils/player'

interface PlayerCardProps {
  player: Player | null
  onToggleRole?: (roleIndex: number) => void
  onRemove?: () => void
  onEdit?: (updatedPlayer: Player) => void
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
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
    setEditablePlayer(player) // 編集開始時に現在のプレイヤーデータをセット
  }

  const handleSaveEdit = () => {
    if (editablePlayer && onEdit) {
      onEdit(editablePlayer)
    }
    setIsEditing(false)
  }

  const handleRoleChange = (roleIndex: number) => {
    if (editablePlayer) {
      const updatedRoles = [...editablePlayer.desiredRoles]
      updatedRoles[roleIndex] = !updatedRoles[roleIndex]
      setEditablePlayer({ ...editablePlayer, desiredRoles: updatedRoles })
    }
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      {/* 非展開時 */}
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
        <button
          onClick={handleToggleExpand}
          className="text-blue-500 hover:text-blue-700 transition"
        >
          {isExpanded ? '▲ 閉じる' : '▼ 詳細'}
        </button>
      </div>

      {/* 展開時 */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div className="mt-4 border-t pt-4">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editablePlayer?.name || ''}
                onChange={(e) =>
                  setEditablePlayer({
                    ...editablePlayer!,
                    name: e.target.value,
                  })
                }
                className="p-2 border border-gray-300 rounded w-full"
              />
              <select
                value={editablePlayer?.tier || ''}
                onChange={(e) =>
                  setEditablePlayer({
                    ...editablePlayer!,
                    tier: e.target.value as Player['tier'],
                  })
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
                  setEditablePlayer({
                    ...editablePlayer!,
                    rank: e.target.value as Player['rank'],
                  })
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
                      onChange={() => handleRoleChange(index)}
                    />
                    <span className="text-xs">{role}</span>
                  </label>
                ))}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  保存
                </button>
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                >
                  キャンセル
                </button>
              </div>
            </div>
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
                      onChange={() => onToggleRole?.(index)}
                      disabled
                    />
                    <span className="text-xs">{role}</span>
                  </label>
                ))}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleEditToggle}
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
      </div>
    </div>
  )
}

export default PlayerCard
