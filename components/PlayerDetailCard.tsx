import React from 'react'

import { FaLock, FaStarOfLife } from 'react-icons/fa6'

import { Player } from '../utils/player'
import { roleEnum, roleList } from '../utils/role'

interface PlayerDetailCardProps {
  currentPlayer: Player
  onEditModeToggle: (e: React.MouseEvent) => void
  onDeleteModeToggle: (e: React.MouseEvent) => void
}

const PlayerDetailCard: React.FC<PlayerDetailCardProps> = ({
  currentPlayer,
  onEditModeToggle,
  onDeleteModeToggle,
}) => {
  const lockIconColor = currentPlayer.isRoleFixed
    ? 'text-black'
    : 'text-gray-200'
  return (
    <div className="p-2">
      <div className="">
        <p className="font-bold">Player Info</p>
        <div className="grid grid-cols-2 gap-2">
          <p className="">Player Name:</p>
          <p className="overflow-hidden text-ellipsis">{currentPlayer.name}</p>
          <p className="">Rank:</p>
          <p className="">{currentPlayer.displayRank}</p>
          <p className="">Main Role:</p>
          <p className="">
            {currentPlayer.mainRole === roleEnum.all ? (
              <>
                <FaStarOfLife className="inline-block rotate-30" />
              </>
            ) : (
              <span>{currentPlayer.mainRole}</span>
            )}
          </p>
          {currentPlayer.mainRole !== roleEnum.all && (
            <>
              <p className="">Sub Role:</p>
              <p className="">
                {currentPlayer.subRole === roleEnum.all ? (
                  <>
                    <FaStarOfLife className="inline-block rotate-30" />
                  </>
                ) : (
                  <span>{currentPlayer.subRole}</span>
                )}
              </p>
            </>
          )}
          <p className="">Desired Role:</p>
          <p className="">
            {roleList
              .filter((_, index) => currentPlayer.desiredRoles[index])
              .join(', ')}
          </p>
          <p className="">Role Fixed:</p>
          <p>
            <FaLock className={lockIconColor} />
          </p>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onEditModeToggle}
            className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={onDeleteModeToggle}
            className="rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlayerDetailCard
