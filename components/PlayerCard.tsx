import React, { useState } from 'react'

import { Player } from '../utils/player'

interface PlayerCardProps {
  player: Player | null
  onToggleRole?: (roleIndex: number) => void
  onRemove?: () => void
  onAddPlayer?: (name: string, tag: string) => void
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onToggleRole,
  onRemove,
  onAddPlayer,
}) => {
  const [name, setName] = useState<string>('')
  const [tag, setTag] = useState<string>('')

  const handleAdd = () => {
    if (name.trim() && tag.trim() && onAddPlayer) {
      onAddPlayer(name, tag)
      setName('')
      setTag('')
    }
  }

  if (player) {
    // プレイヤーが存在する場合
    return (
      <div className="p-2 border-b border-gray-300 flex items-center justify-between">
        <div className="flex-1">
          <p className="font-bold whitespace-nowrap">{player.getName()}</p>
          <p className="text-sm text-gray-500">レート: {player.getRating()}</p>
        </div>
        <div className="flex space-x-2">
          {['TOP', 'JG', 'MID', 'ADC', 'SUP'].map((role, roleIndex) => (
            <label key={role} className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={player.getDesiredRole()[roleIndex] === 1}
                onChange={() => onToggleRole && onToggleRole(roleIndex)}
              />
              <span className="text-xs">{role}</span>
            </label>
          ))}
        </div>
        <button
          className="px-2 py-1 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 transition whitespace-nowrap"
          onClick={onRemove}
        >
          削除
        </button>
      </div>
    )
  }

  // プレイヤーが存在しない場合
  return (
    <div className="p-2 border-b border-gray-300 flex items-center justify-between">
      <div className="flex space-x-2 flex-1">
        <input
          type="text"
          placeholder="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-1 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          placeholder="タグ"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="p-1 border border-gray-300 rounded w-full"
        />
      </div>
      <button
        className="px-2 py-1 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600 transition whitespace-nowrap"
        onClick={handleAdd}
      >
        追加
      </button>
    </div>
  )
}

export default PlayerCard
