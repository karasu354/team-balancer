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
            className="w-full rounded border border-gray-300 p-2"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleUpdatePlayer}
            className="rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
          >
            保存
          </button>
          <button
            onClick={onEditModeToggle}
            className="rounded bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlayerEditCard
