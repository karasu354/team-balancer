import React from 'react'

import { IconContext } from 'react-icons'
import {
  FaChevronDown,
  FaChevronUp,
  FaLock,
  FaStarOfLife,
} from 'react-icons/fa6'

import { Player } from '../utils/player'
import { roleEnum, roleList } from '../utils/role'
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

  const lockIconColor = player.isRoleFixed ? 'text-black' : 'text-gray-200'

  return (
    <div className="w-md rounded-lg border border-gray-400 bg-white p-2">
      <div className="flex justify-between" onClick={handleParticipationToggle}>
        <div className="flex w-1/2 items-center justify-start pr-2">
          <div className="max-w-full">
            <p className="overflow-hidden font-bold text-ellipsis">
              {player.name}
            </p>
            <p className="text-xs">({player.displayRank})</p>
          </div>
        </div>
        <div className="flex w-1/2 items-center justify-center gap-4">
          <div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-left">Main</div>
              <div className="text-left">
                {player.mainRole === roleEnum.all ? (
                  <>
                    <FaStarOfLife className="inline-block rotate-30" />
                  </>
                ) : (
                  <span>{player.mainRole}</span>
                )}
              </div>
              {player.mainRole !== roleEnum.all && (
                <>
                  <div className="text-left">Sub</div>
                  <div className="text-left">
                    {player.subRole === roleEnum.all ? (
                      <FaStarOfLife className="inline-block rotate-30" />
                    ) : (
                      <span>{player.subRole}</span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <p className="mr-1">Role</p>
            <FaLock className={lockIconColor} />
          </div>
          <div className="">
            {roleList.map((role, _) => (
              <p
                key={role}
                className={`text-xs ${
                  player.desiredRoles.includes(role as roleEnum)
                    ? 'text-black'
                    : 'text-gray-200'
                }`}
              >
                {role}
              </p>
            ))}
          </div>
          <IconContext.Provider value={{ size: '1rem' }}>
            <button onClick={onToggleExpand} className="">
              {isExpanded ? <FaChevronDown /> : <FaChevronUp />}
            </button>
          </IconContext.Provider>
        </div>
      </div>

      {isExpanded && !isEditMode && (
        <PlayerDetailCard
          currentPlayer={player}
          onEditModeToggle={handleEditModeToggle}
          onPlayerUpdate={onCurrentPlayerUpdate}
          onRemove={onRemove}
        />
      )}

      {isExpanded && isEditMode && (
        <PlayerEditCard
          currentPlayer={player}
          setEditablePlayer={(updatedPlayer) =>
            onCurrentPlayerUpdate(updatedPlayer)
          }
          onEditModeToggle={handleEditModeToggle}
        />
      )}
    </div>
  )
}

export default PlayerCard
