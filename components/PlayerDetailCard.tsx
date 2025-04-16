import React from 'react'

import { Player } from '../utils/player'

interface PlayerDetailCardProps {
  player: Player
  onRoleChange: (roleIndex: number) => void
  onRemove: () => void
}

const PlayerDetailCard: React.FC<PlayerDetailCardProps> = ({
  player,
  onRoleChange,
  onRemove,
}) => {
  const handleRoleChange = (roleIndex: number) => {
    const updatedRoles = [...player.desiredRoles]
    updatedRoles[roleIndex] = !updatedRoles[roleIndex]
    onRoleChange(roleIndex)
  }

  return (
    <div className="mt-4 border-t pt-4">
      <div className="space-y-2">
        <p className="text-sm font-bold">プレイヤー情報</p>
        <div className="grid grid-cols-2 gap-2">
          <p className="text-sm font-medium">名前:</p>
          <p className="text-sm">{player.name}</p>
          <p className="text-sm font-medium">ティア:</p>
          <p className="text-sm">{player.tier}</p>
          <p className="text-sm font-medium">ランク:</p>
          <p className="text-sm">{player.rank}</p>
          <p className="text-sm font-medium">レーティング:</p>
          <p className="text-sm">
            {player.isParticipatingInGame ? '参加中' : '未参加'}
          </p>
          <p className="text-sm font-medium">希望ロール:</p>
          <p className="text-sm">
            {['TOP', 'JG', 'MID', 'ADC', 'SUP']
              .filter((_, index) => player.desiredRoles[index])
              .join(', ')}
          </p>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => {}}
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
    </div>
  )
}

export default PlayerDetailCard
