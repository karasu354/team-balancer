import React, { useState } from 'react'

import { roleList } from '../utils/role'
import { TeamBalancer } from '../utils/teamBalancer'

interface DividedTeamTableProps {
  teamBalancer: TeamBalancer
  onAppUpdate: () => void
}

const DividedTeamTable: React.FC<DividedTeamTableProps> = ({
  teamBalancer,
  onAppUpdate,
}) => {
  const balancedTeamsByMisMatch = teamBalancer.balancedTeamsByMisMatch
  const [activeTab, setActiveTab] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleTabChange = (tabIndex: number) => {
    setActiveTab(tabIndex)
  }

  const handleDivideTeams = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      teamBalancer.divideTeams()
      onAppUpdate()
    } catch (error) {
      alert(
        'チーム分けに失敗しました。プレイヤーが10人揃っているか確認してください。'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyToClipboard = () => {
    const activeBalancedTeam = balancedTeamsByMisMatch[activeTab]
    const lanes = roleList
    const blueTeam = lanes
      .map(
        (lane, index) =>
          `${lane}: ${activeBalancedTeam.players[index].name || 'N/A'}`
      )
      .join('\n')
    const redTeam = lanes
      .map(
        (lane, index) =>
          `${lane}: ${activeBalancedTeam.players[index + 5].name || 'N/A'}`
      )
      .join('\n')

    const result = `Blue Team\n${blueTeam}\n\nRed Team\n${redTeam}`
    navigator.clipboard.writeText(result)
    alert('チーム結果をクリップボードにコピーしました！')
  }

  const activeBalancedTeam = balancedTeamsByMisMatch[activeTab]
  const isDivideButtonDisabled = teamBalancer.isDividable() === false

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-4 flex justify-center space-x-4">
        <button
          onClick={handleDivideTeams}
          disabled={isLoading || isDivideButtonDisabled}
          className={`rounded px-4 py-2 ${
            isLoading || isDivideButtonDisabled
              ? 'cursor-not-allowed bg-gray-400 text-gray-700'
              : 'bg-green-500 text-white transition hover:bg-green-600'
          }`}
        >
          {isLoading ? 'Dividing teams...' : 'Divide Teams'}
        </button>
        <button
          onClick={handleCopyToClipboard}
          disabled={activeBalancedTeam.players.length === 0}
          className={`rounded px-4 py-2 ${
            activeBalancedTeam.players.length === 0
              ? 'cursor-not-allowed bg-gray-400 text-gray-700'
              : 'bg-blue-500 text-white transition hover:bg-blue-600'
          }`}
        >
          Copy Member
        </button>
      </div>

      <div className="flex">
        <div className="mr-4 flex flex-col space-y-2">
          {Object.keys(balancedTeamsByMisMatch).map((key) => (
            <button
              key={key}
              onClick={() => handleTabChange(Number(key))}
              disabled={
                balancedTeamsByMisMatch[Number(key)].players.length === 0
              }
              className={`rounded px-4 py-2 ${
                Number(key) === activeTab
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              } ${
                balancedTeamsByMisMatch[Number(key)].players.length === 0
                  ? 'cursor-not-allowed opacity-50'
                  : ''
              }`}
            >
              Mismatch Player : {key}
            </button>
          ))}
        </div>

        <div className="flex-1 rounded-lg border border-gray-300 p-4">
          {activeBalancedTeam.players.length === 10 && (
            <div>
              <p>Rating Difference {activeBalancedTeam.evaluationScore}</p>
              <div className="flex">
                <div className="w-1/3">
                  <div className="mb-4 font-bold">Lane</div>
                  {roleList.map((lane) => (
                    <div key={lane} className="mb-2 font-medium">
                      {lane}
                    </div>
                  ))}
                </div>
                <div className="w-1/3">
                  <div className="mb-4 text-xl font-bold text-blue-500">
                    Blue Team
                  </div>
                  {roleList.map((lane, index) => (
                    <div key={lane} className="mb-2">
                      {activeBalancedTeam.players[index].name || 'N/A'} (
                      {activeBalancedTeam.players[index].rating})
                    </div>
                  ))}
                </div>
                <div className="w-1/3">
                  <div className="mb-4 text-xl font-bold text-red-500">
                    Red Team
                  </div>
                  {roleList.map((lane, index) => (
                    <div key={lane} className="mb-2">
                      {activeBalancedTeam.players[index + 5].name || 'N/A'} (
                      {activeBalancedTeam.players[index + 5].rating})
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DividedTeamTable
