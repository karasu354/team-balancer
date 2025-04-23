import React, { useState } from 'react'

import { rankEnum, tierEnum } from '../utils/rank'
import { roleEnum } from '../utils/role'
import { TeamBalancer } from '../utils/teamBalancer'
import ChatLogInputForm from './ChatLogInputForm'

interface PlayerInputFormProps {
  teamBalancer: TeamBalancer
  onAddPlayer: (
    name: string,
    tier: tierEnum,
    rank: rankEnum,
    mainRole: roleEnum,
    subRole: roleEnum
  ) => void
  onAppUpdate: () => void
}

const PlayerInputForm: React.FC<PlayerInputFormProps> = ({
  teamBalancer,
  onAddPlayer,
  onAppUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single')
  const [name, setName] = useState('')
  const [tier, setTier] = useState<tierEnum>(tierEnum.gold)
  const [rank, setRank] = useState<rankEnum>(rankEnum.two)
  const [mainRole, setMainRole] = useState<roleEnum>(roleEnum.all)
  const [subRole, setSubRole] = useState<roleEnum>(roleEnum.all)

  const initForm = () => {
    setName('')
    setTier(tierEnum.gold)
    setRank(rankEnum.two)
    setMainRole(roleEnum.all)
    setSubRole(roleEnum.all)
  }

  const handleAddPlayer = () => {
    onAddPlayer(name, tier, rank, mainRole, subRole)
    initForm()
  }

  const isRankDisabled = [
    tierEnum.master,
    tierEnum.grandmaster,
    tierEnum.challenger,
  ].includes(tier)

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-4 flex">
        <button
          onClick={() => setActiveTab('single')}
          className={`rounded px-4 py-2 ${
            activeTab === 'single'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          1人ずつ追加
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`rounded px-4 py-2 ${
            activeTab === 'bulk'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          まとめて追加
        </button>
      </div>

      <div className="h-48">
        {activeTab === 'single' ? (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Player Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border border-gray-300 p-2"
              />
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as tierEnum)}
                className="w-full rounded border border-gray-300 p-2"
              >
                {Object.values(tierEnum).map((tierValue) => (
                  <option key={tierValue} value={tierValue}>
                    {tierValue}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={rank}
                onChange={(e) => setRank(e.target.value as rankEnum)}
                className={`w-full rounded border p-2 ${
                  isRankDisabled
                    ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                    : 'border-gray-300'
                }`}
                disabled={isRankDisabled}
              >
                {Object.values(rankEnum).map((rankValue) => (
                  <option key={rankValue} value={rankValue}>
                    {rankValue}
                  </option>
                ))}
              </select>
              <select
                value={mainRole}
                onChange={(e) => setMainRole(e.target.value as roleEnum)}
                className="w-full rounded border border-gray-300 p-2"
              >
                {Object.values(roleEnum).map((roleValue) => (
                  <option key={roleValue} value={roleValue}>
                    {roleValue}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={subRole}
              onChange={(e) => setSubRole(e.target.value as roleEnum)}
              className="w-full rounded border border-gray-300 p-2"
            >
              {Object.values(roleEnum).map((roleValue) => (
                <option key={roleValue} value={roleValue}>
                  {roleValue}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddPlayer}
              className="rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
            >
              追加
            </button>
          </div>
        ) : (
          <ChatLogInputForm
            teamBalancer={teamBalancer}
            onAppUpdate={onAppUpdate}
          />
        )}
      </div>
    </div>
  )
}

export default PlayerInputForm
