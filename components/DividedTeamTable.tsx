import React, { useState } from 'react'

import { TeamDivider } from '../utils/teamDivider'

interface DividedTeamTableProps {
  teamDivider: TeamDivider
  onTeamsUpdate: () => void
}

const DividedTeamTable: React.FC<DividedTeamTableProps> = ({
  teamDivider,
  onTeamsUpdate,
}) => {
  const teamDivisions = teamDivider.getTeamDivisions()
  const [activeTab, setActiveTab] = useState<number>(0) // 現在選択されているタブ
  const [isLoading, setIsLoading] = useState<boolean>(false) // ローディング状態

  const handleTabChange = (tabIndex: number) => {
    setActiveTab(tabIndex)
  }

  const handleDivideTeams = async () => {
    setIsLoading(true) // ローディング開始
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)) // 擬似的な遅延
      teamDivider.divideTeams()
      onTeamsUpdate()
    } catch (error) {
      alert(
        'チーム分けに失敗しました。プレイヤーが10人揃っているか確認してください。'
      )
    } finally {
      setIsLoading(false) // ローディング終了
    }
  }

  const handleCopyToClipboard = () => {
    const activeDivision = teamDivisions[activeTab]
    const lanes = ['TOP', 'JG', 'MID', 'ADC', 'SUP']
    const blueTeam = lanes
      .map(
        (lane, index) =>
          `${lane}: ${activeDivision.players[index]?.getName() || 'N/A'}`
      )
      .join('\n')
    const redTeam = lanes
      .map(
        (lane, index) =>
          `${lane}: ${activeDivision.players[index + 5]?.getName() || 'N/A'}`
      )
      .join('\n')

    const result = `Blue Team\n${blueTeam}\n\nRed Team\n${redTeam}`
    navigator.clipboard.writeText(result)
    alert('チーム結果をクリップボードにコピーしました！')
  }

  const activeDivision = teamDivisions[activeTab]
  const isDivideButtonDisabled =
    teamDivider.getPlayers().filter((p) => p !== null).length !== 10

  return (
    <div className="w-full max-w-4xl">
      {/* チームを分けるボタン */}
      <div className="mb-4 flex justify-center space-x-4">
        <button
          onClick={handleDivideTeams}
          disabled={isLoading || isDivideButtonDisabled}
          className={`px-4 py-2 rounded ${
            isLoading || isDivideButtonDisabled
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600 transition'
          }`}
        >
          {isLoading ? '分けています...' : 'チームを分ける'}
        </button>
        <button
          onClick={handleCopyToClipboard}
          disabled={activeDivision.players.length === 0}
          className={`px-4 py-2 rounded ${
            activeDivision.players.length === 0
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 transition'
          }`}
        >
          結果をコピー
        </button>
      </div>

      <div className="flex">
        {/* タブ */}
        <div className="flex flex-col space-y-2 mr-4">
          {Object.keys(teamDivisions).map((key) => (
            <button
              key={key}
              onClick={() => handleTabChange(Number(key))}
              disabled={teamDivisions[Number(key)].players.length === 0}
              className={`px-4 py-2 rounded ${
                Number(key) === activeTab
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              } ${
                teamDivisions[Number(key)].players.length === 0
                  ? 'cursor-not-allowed opacity-50'
                  : ''
              }`}
            >
              {key}人ミスマッチ
            </button>
          ))}
        </div>

        {/* チーム表示 */}
        <div className="flex-1 border border-gray-300 rounded-lg p-4">
          <div className="flex">
            {/* レーン情報 */}
            <div className="w-1/3">
              <div className="mb-4 font-bold">
                Lane（
                {activeDivision.evaluationScore}）
              </div>
              {['TOP', 'JG', 'MID', 'ADC', 'SUP'].map((lane) => (
                <div key={lane} className="mb-2 font-medium">
                  {lane}
                </div>
              ))}
            </div>
            {/* Blue Team */}
            <div className="w-1/3">
              <div className="mb-4 text-xl font-bold text-blue-500">
                Blue Team
              </div>
              {['TOP', 'JG', 'MID', 'ADC', 'SUP'].map((lane, index) => (
                <div key={lane} className="mb-2">
                  {activeDivision.players[index]?.getName() || 'N/A'} (
                  {activeDivision.players[index]?.getRating() || 'N/A'})
                </div>
              ))}
            </div>
            {/* Red Team */}
            <div className="w-1/3">
              <div className="mb-4 text-xl font-bold text-red-500">
                Red Team
              </div>
              {['TOP', 'JG', 'MID', 'ADC', 'SUP'].map((lane, index) => (
                <div key={lane} className="mb-2">
                  {activeDivision.players[index + 5]?.getName() || 'N/A'} (
                  {activeDivision.players[index + 5]?.getRating() || 'N/A'})
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DividedTeamTable
