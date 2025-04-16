import React from 'react'

import { Player } from '../utils/player'
import PlayerDetailCard from './PlayerDetailCard'

interface PlayerCardProps {
  player: Player
  isExpanded: boolean
  onPlayersUpdate: () => void
  onToggleExpand: () => void
  onToggleRole?: (roleIndex: number) => void
  onRemove: () => void
  onToggleParticipating: () => void
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isExpanded,
  onPlayersUpdate,
  onToggleExpand,
  onToggleRole,
  onRemove,
  onToggleParticipating,
}) => {
  const handleParticipationToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleParticipating()
  }

  return (
    <div
      className={`border border-gray-300 rounded-lg p-4 cursor-pointer transition ${
        player.isParticipatingInGame
          ? 'bg-blue-100' // 参加している場合の背景色
          : isExpanded
            ? 'bg-gray-100' // 展開されている場合の背景色
            : 'bg-white hover:bg-gray-50' // 通常時の背景色
      }`}
      onClick={onToggleExpand}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {' '}
          {/* 横並びにして中央揃え */}
          <p className="text-lg font-bold">{player.name}</p>
          <p className="text-sm text-gray-500">({player.rating})</p>
          <p className="text-sm text-gray-500">
            希望ロール:{' '}
            {['TOP', 'JG', 'MID', 'ADC', 'SUP']
              .filter((_, index) => player.desiredRoles[index])
              .join(', ')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <label
            className="flex items-center space-x-1"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={player.isParticipatingInGame}
              onClick={handleParticipationToggle}
            />
            <span className="text-sm">参加</span>
          </label>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpand()
            }}
            className="text-blue-500 hover:text-blue-700 transition"
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <PlayerDetailCard
          player={player}
          onRoleChange={onToggleRole!}
          onRemove={onRemove!}
        />
      )}
    </div>
  )
}

export default PlayerCard
