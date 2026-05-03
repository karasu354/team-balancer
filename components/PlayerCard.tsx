import React from 'react'

import { IconContext } from 'react-icons'
import { FaCheckSquare } from 'react-icons/fa'
import { FaChevronDown, FaRegSquare } from 'react-icons/fa6'

import { Player } from '../utils/player'
import PlayerInfoDisplay from './Display/PlayerInfoDisplay'
import PlayerNameDisplay from './Display/PlayerNameDisplay'
import PlayerDeleteCard from './PlayerDeleteCard'
import PlayerDetailCard from './PlayerDetailCard'
import PlayerEditCard from './PlayerEditCard'

interface PlayerCardProps {
  player: Player
  isExpanded: boolean
  isEditMode: boolean
  isDeleteMode: boolean
  onToggleExpand: (e: React.MouseEvent) => void
  onEditModeToggle: (e: React.MouseEvent) => void
  onDeleteModeToggle: (e: React.MouseEvent) => void
  onCurrentPlayerUpdate: (updatedPlayer: Player) => void
  onRemove: () => void
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isExpanded,
  isEditMode,
  isDeleteMode,
  onToggleExpand,
  onEditModeToggle,
  onDeleteModeToggle,
  onCurrentPlayerUpdate,
  onRemove,
}) => {
  const handleParticipationToggle = () => {
    player.isParticipatingInGame = !player.isParticipatingInGame
    onCurrentPlayerUpdate(player)
  }

  return (
    <div className="h-min w-full overflow-hidden rounded border border-[var(--tb-border)] bg-[var(--tb-surface)] shadow-sm">
      <div className="flex">
        <div
          className="flex w-10 cursor-pointer items-center justify-center border-r border-[var(--tb-border)] bg-[var(--tb-surface-muted)] hover:brightness-125"
          onClick={handleParticipationToggle}
          title="参加切替"
        >
          <IconContext.Provider
            value={{
              size: '1.5rem',
              className: 'text-[var(--tb-text-secondary)]',
            }}
          >
            {player.isParticipatingInGame ? <FaCheckSquare /> : <FaRegSquare />}
          </IconContext.Provider>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden p-2 select-none">
          <PlayerNameDisplay player={player} />
          <PlayerInfoDisplay player={player} />
        </div>

        <div
          className="flex min-w-5 flex-shrink-0 cursor-pointer items-center justify-center bg-[var(--tb-surface-muted)] hover:brightness-125"
          onClick={onToggleExpand}
        >
          <IconContext.Provider value={{ size: '1rem' }}>
            <button
              className={`text-[var(--tb-text-secondary)] transition-transform duration-200 ${
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
        {!isDeleteMode && !isEditMode && (
          <PlayerDetailCard
            currentPlayer={player}
            onEditModeToggle={onEditModeToggle}
            onDeleteModeToggle={onDeleteModeToggle}
          />
        )}

        {!isDeleteMode && isEditMode && (
          <PlayerEditCard
            currentPlayer={player}
            setEditablePlayer={(updatedPlayer) =>
              onCurrentPlayerUpdate(updatedPlayer)
            }
            onEditModeToggle={onEditModeToggle}
          />
        )}

        {isDeleteMode && (
          <PlayerDeleteCard
            playerName={player.name}
            onDelete={onRemove}
            onDeleteModeToggle={onDeleteModeToggle}
          />
        )}
      </div>
    </div>
  )
}

export default PlayerCard
