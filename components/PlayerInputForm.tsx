import React, { useState } from 'react'

import { rankEnum, tierEnum } from '../utils/rank'
import { TeamBalancer } from '../utils/teamBalancer'
import ChatLogInputForm from './ChatLogInputForm'

interface PlayerInputFormProps {
  teamBalancer: TeamBalancer
  onAddPlayer: (name: string, tier: tierEnum, rank: rankEnum) => void
  onPlayersUpdate: () => void
}

const PlayerInputForm: React.FC<PlayerInputFormProps> = ({
  teamBalancer,
  onAddPlayer,
  onPlayersUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single')
  const [name, setName] = useState('')
  const [tier, setTier] = useState<tierEnum>(tierEnum.gold)
  const [rank, setRank] = useState<rankEnum>(rankEnum.two)

  const initForm = () => {
    setName('')
    setTier(tierEnum.gold)
    setRank(rankEnum.two)
  }

  const handleAddPlayer = () => {
    if (name.trim()) {
      onAddPlayer(name, tier, rank)
      initForm()
    } else {
      alert('Riot ID、ティア、ランクを入力してください')
    }
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
          className={`px-4 py-2 rounded ${
            activeTab === 'single'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          1人ずつ追加
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`px-4 py-2 rounded ${
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
                className="p-2 border border-gray-300 rounded w-full"
              />
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as tierEnum)}
                className="p-2 border border-gray-300 rounded w-full"
              >
                {Object.values(tierEnum).map((tierValue) => (
                  <option key={tierValue} value={tierValue}>
                    {tierValue}
                  </option>
                ))}
              </select>
              <select
                value={rank}
                onChange={(e) => setRank(e.target.value as rankEnum)}
                className={`p-2 border rounded w-full ${
                  isRankDisabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
            </div>
            <button
              onClick={handleAddPlayer}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              追加
            </button>
          </div>
        ) : (
          <ChatLogInputForm
            teamBalancer={teamBalancer}
            onPlayersUpdate={onPlayersUpdate}
          />
        )}
      </div>
    </div>
  )
}

export default PlayerInputForm
