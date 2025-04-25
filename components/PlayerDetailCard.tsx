import React from 'react'

import { Player } from '../utils/player'
import { roleList } from '../utils/role'

interface PlayerDetailCardProps {
  currentPlayer: Player
  onPlayerUpdate: (updatedPlayer: Player) => void
  onEditModeToggle: (e: React.MouseEvent) => void
  onRemove: () => void
}

const PlayerDetailCard: React.FC<PlayerDetailCardProps> = ({
  currentPlayer,
  onEditModeToggle,
  onPlayerUpdate,
  onRemove,
}) => {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRemove()
  }
  return (
    <div className="mt-4 border-t pt-4">
      <div className="space-y-2">
        <p className="text-sm font-bold">プレイヤー情報</p>
        <div className="grid grid-cols-2 gap-2">
          <p className="text-sm font-medium">名前:</p>
          <p className="text-sm">{currentPlayer.name}</p>
          <p className="text-sm font-medium">ティア:</p>
          <p className="text-sm">{currentPlayer.tier}</p>
          <p className="text-sm font-medium">ランク:</p>
          <p className="text-sm">{currentPlayer.rank}</p>
          <p className="text-sm font-medium">レーティング:</p>
          <p className="text-sm">{currentPlayer.rating}</p>
          <p className="text-sm font-medium">希望ロール:</p>
          <p className="text-sm">
            {roleList
              .filter((_, index) => currentPlayer.desiredRoles[index])
              .join(', ')}
          </p>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onEditModeToggle}
            className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
          >
            編集
          </button>
          <button
            onClick={handleRemove}
            className="rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlayerDetailCard
