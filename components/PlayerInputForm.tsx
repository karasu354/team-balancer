import React, { useState } from 'react'

import { rankEnum, tierEnum } from '../utils/rank'
import { roleEnum } from '../utils/role'
import { TeamBalancer } from '../utils/teamBalancer'
import ChatLogInputForm from './Form/ChatLogInputForm'
import SinglePlayerInputForm from './Form/SinglePlayerInputForm'

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
          <SinglePlayerInputForm
            name={name}
            setName={setName}
            tier={tier}
            setTier={setTier}
            rank={rank}
            setRank={setRank}
            mainRole={mainRole}
            setMainRole={setMainRole}
            subRole={subRole}
            setSubRole={setSubRole}
            onAddPlayer={handleAddPlayer}
            isRankDisabled={isRankDisabled}
          />
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
