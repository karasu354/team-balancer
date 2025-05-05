import React from 'react'

import { Player } from '../utils/player'
import { isNoRankTier, rankEnum, tierEnum } from '../utils/rank'
import { roleEnum } from '../utils/role'
import CheckBox from './Input/CheckBox'
import Dropdown from './Input/Dropdown'
import InputText from './Input/InputText'

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
  const [player, setPlayer] = React.useState<Player>(
    Player.fromJson(currentPlayer.playerInfo)
  )

  const updatePlayerProperty = <K extends keyof Player>(
    key: K,
    value: Player[K]
  ) => {
    setPlayer((prevPlayer) => {
      const updatedPlayer = Player.fromJson(prevPlayer.playerInfo)
      Object.assign(updatedPlayer, prevPlayer, { [key]: value })
      if (key === 'tier' || key === 'rank') {
        updatedPlayer.setCalculatedRating()
        updatedPlayer.setDisplayRank()
      }
      return updatedPlayer
    })
  }

  const handleSetDesiredRoles = (roles: roleEnum[]) => {
    if (roles.includes(roleEnum.all)) {
      updatePlayerProperty(
        'desiredRoles',
        Object.values(roleEnum).filter((role) => role !== roleEnum.all)
      )
    } else {
      updatePlayerProperty('desiredRoles', roles)
    }
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditablePlayer(player)
    onEditModeToggle(e)
  }

  return (
    <div className="p-2">
      <div className="space-y-2">
        <p className="font-bold">Player Edit</p>
        <InputText
          value={player.name}
          setValue={(value) => updatePlayerProperty('name', value)}
          label="Player Name"
        />
        <Dropdown
          value={player.tier}
          setValue={(value) => updatePlayerProperty('tier', value as tierEnum)}
          label="Tier"
          options={Object.values(tierEnum).map((tierValue) => ({
            label: tierValue,
            value: tierValue,
          }))}
        />
        {isNoRankTier(player.tier) === false && (
          <div className="flex items-center space-x-2">
            <p>┗</p>
            <Dropdown
              value={player.rank}
              setValue={(value) =>
                updatePlayerProperty('rank', value as rankEnum)
              }
              label="Rank"
              options={Object.values(rankEnum).map((rankValue) => ({
                label: rankValue,
                value: rankValue,
              }))}
            />
          </div>
        )}

        <Dropdown
          value={player.mainRole}
          setValue={(value) =>
            updatePlayerProperty('mainRole', value as roleEnum)
          }
          label="Main Role"
          options={Object.values(roleEnum).map((roleValue) => ({
            label: roleValue,
            value: roleValue,
          }))}
        />
        {player.mainRole !== roleEnum.all && (
          <Dropdown
            value={player.subRole}
            setValue={(value) =>
              updatePlayerProperty('subRole', value as roleEnum)
            }
            label="Sub Role"
            options={Object.values(roleEnum)
              .filter(
                (role) => role !== roleEnum.all && role !== player.mainRole
              )
              .map((roleValue) => ({
                label: roleValue,
                value: roleValue,
              }))}
          />
        )}

        <CheckBox
          values={player.desiredRoles}
          setValues={(roles) => handleSetDesiredRoles(roles as roleEnum[])}
          label="Desired Roles"
          options={Object.values(roleEnum).map((roleValue) => ({
            label: roleValue,
            value: roleValue,
          }))}
        />

        {/* Role Fixed */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={player.isRoleFixed}
            onChange={(e) =>
              updatePlayerProperty('isRoleFixed', e.target.checked)
            }
            id="role-fixed-toggle"
          />
          <label htmlFor="role-fixed-toggle" className="text-sm">
            Role Fixed
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleSave}
            className="rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
          >
            保存
          </button>
          <button
            onClick={onEditModeToggle}
            className="rounded bg-red-500 px-4 py-2 text-white transition hover:bg-gray-600"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlayerEditCard
