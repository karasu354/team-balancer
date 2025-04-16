import React from 'react'

import { Player } from '../utils/player'

interface PlayerEditCardProps {
  currentPlayer: Player
  setEditablePlayer: (player: Player) => void
  onEditModeToggle: (e: React.MouseEvent) => void
}

const PlayerEditCard: React.FC<PlayerEditCardProps> = ({
  currentPlayer,
  setEditablePlayer,
  onEditModeToggle,
}) => {
  const [name, setName] = React.useState(currentPlayer.name)

  const handleUpdatePlayer = (e: React.MouseEvent) => {
    e.stopPropagation()
    currentPlayer.name = name
    onEditModeToggle(e)
  }

  return (
    <div className="mt-4 border-t pt-4">
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Player Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleUpdatePlayer}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            保存
          </button>
          <button
            onClick={onEditModeToggle}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlayerEditCard
