import React from 'react'

import { IconContext } from 'react-icons'
import { FaCheckSquare } from 'react-icons/fa'
import { FaChevronDown, FaRegSquare } from 'react-icons/fa6'

import { Player } from '../utils/player'
import PlayerInfoDisplay from './Display/PlayerInfoDisplay'
import PlayerNameDisplay from './Display/PlayerNameDisplay'
import PlayerDetailCard from './PlayerDetailCard'
import PlayerEditCard from './PlayerEditCard'

interface PlayerCardProps {
  player: Player
  isExpanded: boolean
  onToggleExpand: (e: React.MouseEvent) => void
  onCurrentPlayerUpdate: (updatedPlayer: Player) => void
  onRemove: () => void
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isExpanded,
  onToggleExpand,
  onCurrentPlayerUpdate,
  onRemove,
}) => {
  const [isEditMode, setIsEditMode] = React.useState(false)

  const handleEditModeToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditMode((prev) => !prev)
  }

  const handleParticipationToggle = () => {
    player.isParticipatingInGame = !player.isParticipatingInGame
    onCurrentPlayerUpdate(player)
  }

  return (
    <div className="h-min w-md overflow-hidden rounded border border-gray-400 bg-white">
      <div className="flex">
        <div
          className="flex w-10 cursor-pointer items-center justify-center border-r border-gray-300 bg-gray-200 hover:brightness-80"
          onClick={handleParticipationToggle}
          title="Toggle Participation"
        >
          <IconContext.Provider
            value={{ size: '1.5rem', className: 'text-gray-600' }}
          >
            {player.isParticipatingInGame ? <FaCheckSquare /> : <FaRegSquare />}
          </IconContext.Provider>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden p-2 select-none">
          <PlayerNameDisplay player={player} />
          <PlayerInfoDisplay player={player} />
        </div>

        <div
          className="flex min-w-5 flex-shrink-0 cursor-pointer items-center justify-center bg-gray-400 hover:brightness-80"
          onClick={onToggleExpand}
        >
          <IconContext.Provider value={{ size: '1rem' }}>
            <button
              className={`text-gray-300 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : 'rotate-0'
              }`}
            >
              <FaChevronDown />
            </button>
          </IconContext.Provider>
        </div>
      </div>

      <div
        className={`transition-all duration-200 select-none ${
          isExpanded
            ? 'max-h-screen opacity-100'
            : 'max-h-0 overflow-hidden opacity-0'
        }`}
      >
        {!isEditMode && (
          <PlayerDetailCard
            currentPlayer={player}
            onEditModeToggle={handleEditModeToggle}
            onPlayerUpdate={onCurrentPlayerUpdate}
            onRemove={onRemove}
          />
        )}

        {isEditMode && (
          <PlayerEditCard
            currentPlayer={player}
            setEditablePlayer={(updatedPlayer) =>
              onCurrentPlayerUpdate(updatedPlayer)
            }
            onEditModeToggle={handleEditModeToggle}
          />
        )}
      </div>
    </div>
  )
}

export default PlayerCard
