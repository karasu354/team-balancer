import React from 'react'

import { Player } from '../../utils/player'
import { rankEnum, tierEnum } from '../../utils/rank'
// CheckBox コンポーネントをインポート
import { isNoRankTier } from '../../utils/rank'
import { roleEnum } from '../../utils/role'
import { TeamBalancer } from '../../utils/teamBalancer'
import CheckBox from '../Input/CheckBox'
import Dropdown from '../Input/Dropdown'
import InputText from '../Input/InputText'

interface SinglePlayerInputFormProps {
  teamBalancer: TeamBalancer
  onAppUpdate: () => void
}

const SinglePlayerInputForm: React.FC<SinglePlayerInputFormProps> = ({
  teamBalancer,
  onAppUpdate,
}) => {
  const [player, setPlayer] = React.useState(new Player())

  const updatePlayerProperty = <K extends keyof Player>(
    key: K,
    value: Player[K]
  ) => {
    setPlayer((prevPlayer) => {
      const updatedPlayer = new Player()
      Object.assign(updatedPlayer, prevPlayer, { [key]: value })
      return updatedPlayer
    })
  }

  const handleAddPlayer = () => {
    teamBalancer.addPlayer(player)
    setPlayer(new Player())
    onAppUpdate()
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

  return (
    <div className="flex flex-col space-y-4">
      <InputText
        value={player.name}
        setValue={(value) => updatePlayerProperty('name', value)}
        label="Player Name"
      />

      <div className="flex space-x-4">
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
        )}
      </div>

      <div className="flex space-x-4">
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
              .filter((role) => role !== roleEnum.all)
              .map((roleValue) => ({
                label: roleValue,
                value: roleValue,
              }))}
          />
        )}
      </div>

      <div className="flex">
        <CheckBox
          values={player.desiredRoles}
          setValues={(roles) => handleSetDesiredRoles(roles as roleEnum[])}
          label="Select Desired Roles"
          options={Object.values(roleEnum).map((roleValue) => ({
            label: roleValue,
            value: roleValue,
          }))}
        />
      </div>

      <button
        onClick={handleAddPlayer}
        className="cursor-pointer rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
      >
        Add Player
      </button>
    </div>
  )
}

export default SinglePlayerInputForm
