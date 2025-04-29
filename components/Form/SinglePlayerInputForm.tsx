import React from 'react'

import { rankEnum, tierEnum } from '../../utils/rank'
import { roleEnum } from '../../utils/role'
import Dropdown from '../Input/Dropdown'
import InputText from '../Input/InputText'

interface SinglePlayerInputFormProps {
  name: string
  setName: (value: string) => void
  tier: tierEnum
  setTier: (value: tierEnum) => void
  rank: rankEnum
  setRank: (value: rankEnum) => void
  mainRole: roleEnum
  setMainRole: (value: roleEnum) => void
  subRole: roleEnum
  setSubRole: (value: roleEnum) => void
  onAddPlayer: () => void
  isRankDisabled: boolean
}

const SinglePlayerInputForm: React.FC<SinglePlayerInputFormProps> = ({
  name,
  setName,
  tier,
  setTier,
  rank,
  setRank,
  mainRole,
  setMainRole,
  subRole,
  setSubRole,
  onAddPlayer,
  isRankDisabled,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      {/* Name Input */}
      <InputText value={name} setValue={setName} label="Player Name" />

      {/* Tier and Rank Dropdowns */}
      <div className="flex space-x-4">
        <Dropdown
          value={tier}
          setValue={(value) => setTier(value as tierEnum)}
          label="Tier"
          options={Object.values(tierEnum).map((tierValue) => ({
            label: tierValue,
            value: tierValue,
          }))}
        />
        <Dropdown
          value={rank}
          setValue={(value) => setRank(value as rankEnum)}
          label="Rank"
          options={Object.values(rankEnum).map((rankValue) => ({
            label: rankValue,
            value: rankValue,
          }))}
        />
      </div>

      {/* Main Role and Sub Role Dropdowns */}
      <div className="flex space-x-4">
        <Dropdown
          value={mainRole}
          setValue={(value) => setMainRole(value as roleEnum)}
          label="Main Role"
          options={Object.values(roleEnum).map((roleValue) => ({
            label: roleValue,
            value: roleValue,
          }))}
        />
        <Dropdown
          value={subRole}
          setValue={(value) => setSubRole(value as roleEnum)}
          label="Sub Role"
          options={Object.values(roleEnum).map((roleValue) => ({
            label: roleValue,
            value: roleValue,
          }))}
        />
      </div>

      {/* Add Player Button */}
      <button
        onClick={onAddPlayer}
        className="rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
      >
        Add Player
      </button>
    </div>
  )
}

export default SinglePlayerInputForm
