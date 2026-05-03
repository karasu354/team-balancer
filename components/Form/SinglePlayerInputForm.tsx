import React from 'react'

import { Player } from '../../utils/player'
import { rankEnum, tierEnum } from '../../utils/rank'
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
  const [errorMessage, setErrorMessage] = React.useState<string>('')
  const playerNameInputRef = React.useRef<HTMLInputElement>(null)

  const updatePlayerProperty = <K extends keyof Player>(
    key: K,
    value: Player[K]
  ) => {
    setErrorMessage('')
    setPlayer((prevPlayer) => {
      const updatedPlayer = new Player()
      Object.assign(updatedPlayer, prevPlayer, { [key]: value })
      if (key === 'tier' || key === 'rank') {
        updatedPlayer.setCalculatedRating()
        updatedPlayer.setDisplayRank()
      }
      return updatedPlayer
    })
  }

  const handleAddPlayer = () => {
    if (!player.name.trim()) {
      setErrorMessage('プレイヤー名は必須です')
      playerNameInputRef.current?.focus()
      return
    }
    teamBalancer.addPlayer(player)
    setPlayer(new Player())
    setErrorMessage('')
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
      {errorMessage && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <InputText
        ref={playerNameInputRef}
        value={player.name}
        setValue={(value) => updatePlayerProperty('name', value)}
        label="プレイヤー名"
        description="プレイヤーの名前を入力します"
        errorMessage={errorMessage ? 'プレイヤー名は必須です' : undefined}
      />

      <div className="flex space-x-4">
        <Dropdown
          value={player.tier}
          setValue={(value) => updatePlayerProperty('tier', value as tierEnum)}
          label="ティア"
          description="ロール選別の基準となるティアを選択します"
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
            label="ランク"
            description="詳細なランクを選択します"
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
          label="メインロール"
          description="最も得意なロール（配置の優先度が高い）"
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
            label="サブロール"
            description="メインの次に得意なロール"
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
          label="希望ロール"
          description="このプレイヤーが希望するロール（複数選択可）"
          options={Object.values(roleEnum).map((roleValue) => ({
            label: roleValue,
            value: roleValue,
          }))}
        />
      </div>

      <button
        onClick={handleAddPlayer}
        className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
      >
        プレイヤーを追加
      </button>
    </div>
  )
}

export default SinglePlayerInputForm
