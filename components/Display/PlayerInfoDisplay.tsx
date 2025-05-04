import React from 'react'

import { FaLock } from 'react-icons/fa6'

import { Player } from '../../utils/player'
import { roleEnum } from '../../utils/role'
import {
  BotRoleIcon,
  JgRoleIcon,
  MidRoleIcon,
  SupRoleIcon,
  TopRoleIcon,
} from '../Icons'

interface PlayerInfoDisplayProps {
  player: Player
}

const getRoleIconComponent = (role: roleEnum) => {
  switch (role) {
    case roleEnum.top:
      return TopRoleIcon
    case roleEnum.jg:
      return JgRoleIcon
    case roleEnum.mid:
      return MidRoleIcon
    case roleEnum.bot:
      return BotRoleIcon
    case roleEnum.sup:
      return SupRoleIcon
    default:
      return () => null
  }
}

const PlayerInfoDisplay: React.FC<PlayerInfoDisplayProps> = ({ player }) => {
  const lockIconColor = player.isRoleFixed ? 'text-yellow-400' : 'text-gray-200'

  return (
    <div className="flex w-full divide-x divide-gray-400">
      {/* Main Role */}
      <div className="w-min-full flex-shrink-0 p-2 text-center">
        <p className="font-bold">Main Role</p>
        <p>{player.mainRole}</p>
      </div>

      {/* Sub Role */}
      <div className="w-min-full flex-shrink-0 p-2 text-center">
        <p className="font-bold">Sub Role</p>
        <p>{player.mainRole === roleEnum.all ? '-' : player.subRole}</p>
      </div>

      {/* Desired Roles */}
      <div className="flex-1 p-2 text-center">
        <div className="flex items-center justify-center gap-2">
          <p className="font-bold">Desired Roles</p>
          <FaLock className={`h-5 w-5 ${lockIconColor}`} />
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {Object.values(roleEnum)
            .filter((role) => role !== roleEnum.all)
            .map((role) => {
              const RoleIcon = getRoleIconComponent(role)
              return (
                <RoleIcon
                  key={role}
                  className={`size-6 ${
                    player.desiredRoles.includes(role)
                      ? 'text-yellow-400 opacity-100'
                      : 'text-gray-600 opacity-30'
                  }`}
                />
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default PlayerInfoDisplay
