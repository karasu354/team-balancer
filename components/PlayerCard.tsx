import React from 'react'

import { Player } from '../utils/player'

interface PlayerCardProps {
  player: Player | null
  onToggleRole?: (roleIndex: number) => void
  onRemove?: () => void
  onEdit?: () => void
  onToggleParticipation?: () => void // 参加フラグの切り替え
  onToggleRoleFixed?: () => void // isRoleFixedフラグの切り替え
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onToggleRole,
  onRemove,
  onEdit,
  onToggleParticipation,
  onToggleRoleFixed,
}) => {
  return (
    <div
      className={`p-2 border-b border-gray-300 flex items-center justify-between h-20 ${
        player?.isParticipatingInGame ? 'bg-green-100' : 'bg-gray-100'
      }`}
    >
      {player ? (
        <>
          {/* 参加フラグ */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={player.isParticipatingInGame}
              onChange={onToggleParticipation}
              className="w-5 h-5 cursor-pointer"
            />
          </div>

          {/* プレイヤー情報 */}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <button
                className="text-blue-500 hover:text-blue-700 transition text-sm"
                onClick={onEdit}
              >
                ✎
              </button>
              <p className="font-bold whitespace-nowrap">{player.name}</p>
            </div>
            <p className="text-sm text-gray-500">
              {player.displayRank} ({player.rating})
            </p>
          </div>

          {/* ロール選択 */}
          <div className="flex space-x-2">
            {['TOP', 'JG', 'MID', 'ADC', 'SUP'].map((role, roleIndex) => (
              <label key={role} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={player.desiredRoles[roleIndex]}
                  onChange={() => onToggleRole?.(roleIndex)}
                />
                <span className="text-xs">{role}</span>
              </label>
            ))}
          </div>

          {/* isRoleFixedフラグ */}
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={player.isRoleFixed}
                onChange={onToggleRoleFixed}
                className="w-5 h-5 cursor-pointer"
              />
              <span className="text-xs">固定</span>
            </label>
          </div>

          {/* 削除ボタン */}
          <button
            className="w-8 h-8 flex items-center justify-center text-red-500 rounded-full hover:bg-red-500 hover:text-white hover:border-transparent transition"
            onClick={onRemove}
          >
            x
          </button>
        </>
      ) : (
        <div className="flex-1 text-center text-gray-400">No Player</div>
      )}
    </div>
  )
}

export default PlayerCard
