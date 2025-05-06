import React from 'react'

interface PlayerDeleteCardProps {
  playerName: string
  onDelete: () => void
  onDeleteModeToggle: (e: React.MouseEvent) => void
}

const PlayerDeleteCard: React.FC<PlayerDeleteCardProps> = ({
  playerName,
  onDelete,
  onDeleteModeToggle,
}) => {
  return (
    <div className="p-2">
      <h2 className="text-lg font-bold text-gray-800">Delete Player</h2>
      <p className="mt-4 text-gray-600">
        Are you sure you want to delete the player{' '}
        <span className="font-bold text-red-500">{playerName}</span>? This
        action cannot be undone.
      </p>
      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={onDelete}
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Delete
        </button>
        <button
          onClick={onDeleteModeToggle}
          className="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default PlayerDeleteCard
