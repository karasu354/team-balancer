import React, { useState } from 'react'

import { Player } from '../utils/player'
import { roleList } from '../utils/role'
import { TeamBalancer } from '../utils/teamBalancer'

interface DividedTeamTableProps {
  teamBalancer: TeamBalancer
  onAppUpdate: () => void
}

const getButtonClass = (isDisabled: boolean, active: boolean = false) =>
  `rounded px-4 py-2 ${
    isDisabled
      ? 'cursor-not-allowed bg-gray-400 text-gray-700'
      : active
        ? 'bg-blue-500 text-white'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
  }`

const generateTeamText = (team: Player[], lanes: string[]): string =>
  lanes
    .map((lane, index) => `${lane}: ${team[index]?.name || 'N/A'}`)
    .join('\n')

const DividedTeamTable: React.FC<DividedTeamTableProps> = ({
  teamBalancer,
  onAppUpdate,
}) => {
  const balancedTeamsByMissMatch = teamBalancer.balancedTeamsByMissMatch
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
    const lanes = roleList
    const blueTeamText = generateTeamText(
      activeBalancedTeam.players.slice(0, 5),
      lanes
    )
    const redTeamText = generateTeamText(
      activeBalancedTeam.players.slice(5, 10),
      lanes
    )
    const result = `Blue Team\n${blueTeamText}\n\nRed Team\n${redTeamText}`
    navigator.clipboard.writeText(result)
    alert('チーム結果をクリップボードにコピーしました！')
  }

  const activeBalancedTeam = balancedTeamsByMissMatch[activeTab]
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
          {isLoading ? 'Running...' : 'Divide Teams'}
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
          Copy to Clipboard
        </button>
      </div>

      <div className="flex">
        <div className="mr-4 flex flex-col space-y-2">
          {Object.keys(balancedTeamsByMissMatch).map((key) => (
            <button
              key={key}
              onClick={() => handleTabChange(Number(key))}
              disabled={
                balancedTeamsByMissMatch[Number(key)].players.length === 0
              }
              className={getButtonClass(
                balancedTeamsByMissMatch[Number(key)].players.length === 0,
                Number(key) === activeTab
              )}
            >
              {key}-person mismatch
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
