import React, { useState } from 'react'

import { deleteTeamHistory } from '../composable/api'
import { Player } from '../utils/player'
import { roleList } from '../utils/role'
import { TeamBalancer } from '../utils/teamBalancer'
import MatchHistoryPanel from './MatchHistoryPanel'

const getRoleLabel = (role: string): string => {
  switch (role) {
    case 'top':
      return 'Top'
    case 'jg':
      return 'Jg'
    case 'mid':
      return 'Mid'
    case 'bot':
      return 'Bot'
    case 'sup':
      return 'Sup'
    default:
      return role
  }
}

interface DividedTeamTableProps {
  currentTeamId: string
  teamBalancer: TeamBalancer
  onUpdateTeamBalancer: (teamBalancer: TeamBalancer) => void
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
  currentTeamId,
  teamBalancer,
  onUpdateTeamBalancer,
  onAppUpdate,
}) => {
  const balancedTeamsByMissMatch = teamBalancer.balancedTeamsByMissMatch
  const participatingPlayersCount = teamBalancer.players.filter(
    (player) => player.isParticipatingInGame
  ).length
  const [activeTab, setActiveTab] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedWinner, setSelectedWinner] = useState<'blue' | 'red' | null>(
    null
  )
  const [resultStatusMessage, setResultStatusMessage] = useState<string>('')
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(
    null
  )

  const handleTabChange = (tabIndex: number) => {
    setActiveTab(tabIndex)
    setSelectedWinner(null)
    setResultStatusMessage('')
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
    const result = `青チーム\n${blueTeamText}\n\n赤チーム\n${redTeamText}`
    navigator.clipboard.writeText(result)
    alert('チーム結果をクリップボードにコピーしました！')
  }

  const handleConfirmResult = () => {
    if (!selectedWinner) {
      setResultStatusMessage('勝利チームを選択してください。')
      return
    }

    if (activeBalancedTeam.players.length !== 10) {
      setResultStatusMessage('確定対象の分割結果がありません。')
      return
    }

    try {
      teamBalancer.finalizeMatchResult(
        activeBalancedTeam.players,
        selectedWinner,
        activeTab
      )
      setResultStatusMessage('試合結果を確定し、履歴に保存しました。')
      onAppUpdate()
    } catch (error) {
      setResultStatusMessage('試合結果の確定に失敗しました。')
    }
  }

  const handleToggleHistory = (historyId: string) => {
    setSelectedHistoryId((prev) => (prev === historyId ? null : historyId))
  }

  const handleDeleteHistory = async (historyId: string) => {
    if (!window.confirm('この履歴を削除し、以降のレートを再計算します。')) {
      return
    }

    try {
      if (currentTeamId) {
        const updatedData = await deleteTeamHistory(currentTeamId, historyId)
        onUpdateTeamBalancer(TeamBalancer.fromJson(updatedData))
      } else {
        teamBalancer.deleteMatchHistory(historyId)
        onAppUpdate()
      }

      setSelectedHistoryId((prev) => (prev === historyId ? null : prev))
      setResultStatusMessage('履歴を削除し、レートを再計算しました。')
    } catch (error) {
      setResultStatusMessage('履歴の削除に失敗しました。')
    }
  }

  const activeBalancedTeam = balancedTeamsByMissMatch[activeTab]
  const isDivideButtonDisabled = teamBalancer.isDividable() === false
  const scoreSummaries = Object.entries(balancedTeamsByMissMatch)
    .map(([key, value]) => ({
      mismatchCount: Number(key),
      hasCandidate: value.players.length === 10,
      evaluationScore: value.evaluationScore,
    }))
    .filter((summary) => summary.hasCandidate)
  const bestSummary =
    scoreSummaries.length > 0
      ? scoreSummaries.reduce((best, current) =>
          current.evaluationScore < best.evaluationScore ? current : best
        )
      : null

  return (
    <div className="w-full">
      <div className="mb-3 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">
        分割条件: 参加中プレイヤー 10人（現在 {participatingPlayersCount}/10）
      </div>

      <div className="mb-4 flex flex-wrap justify-center gap-2 md:justify-start">
        <button
          onClick={handleDivideTeams}
          disabled={isLoading || isDivideButtonDisabled}
          className={`rounded px-4 py-2 ${
            isLoading || isDivideButtonDisabled
              ? 'cursor-not-allowed bg-gray-400 text-gray-700'
              : 'bg-green-500 text-white transition hover:bg-green-600'
          }`}
        >
          {isLoading ? 'チーム分け中...' : 'チーム分け'}
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

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex gap-2 overflow-x-auto pb-1 md:mr-2 md:flex-col md:gap-2 md:overflow-visible md:pb-0">
          {scoreSummaries.length > 0 && (
            <div className="mb-2 rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
              <p className="font-semibold">ミスマッチ別最良スコア比較</p>
              <ul className="mt-1 list-disc pl-4">
                {scoreSummaries.map((summary) => (
                  <li key={summary.mismatchCount}>
                    {summary.mismatchCount}人:{' '}
                    {summary.evaluationScore.toFixed(2)}
                    {bestSummary?.mismatchCount === summary.mismatchCount &&
                      ' ← 最小スコア'}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {Object.keys(balancedTeamsByMissMatch).map((key) => (
            <button
              key={key}
              onClick={() => handleTabChange(Number(key))}
              disabled={
                balancedTeamsByMissMatch[Number(key)].players.length === 0
              }
              className={`${getButtonClass(
                balancedTeamsByMissMatch[Number(key)].players.length === 0,
                Number(key) === activeTab
              )} ${
                bestSummary?.mismatchCount === Number(key)
                  ? 'ring-2 ring-emerald-500'
                  : ''
              }`}
            >
              {key}人ミスマッチ
              {balancedTeamsByMissMatch[Number(key)].players.length === 10 &&
                ` (${balancedTeamsByMissMatch[Number(key)].evaluationScore.toFixed(2)})`}
            </button>
          ))}
        </div>

        <div className="flex-1 rounded-lg border border-slate-300 bg-white p-4">
          {activeBalancedTeam.players.length === 10 && (
            <div>
              <p className="mb-3 text-sm text-slate-600">
                評価スコア:{' '}
                <span className="font-semibold text-slate-900">
                  {activeBalancedTeam.evaluationScore.toFixed(2)}
                </span>
              </p>
              <div className="mb-3 rounded border border-amber-200 bg-amber-50 p-3 text-sm">
                <p className="font-semibold text-amber-900">
                  ミスマッチ内訳（{activeBalancedTeam.mismatchDetails.length}
                  件）
                </p>
                {activeBalancedTeam.mismatchDetails.length === 0 ? (
                  <p className="mt-1 text-amber-800">
                    ミスマッチはありません（全員が希望ロールに配置されています）。
                  </p>
                ) : (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-amber-900">
                    {activeBalancedTeam.mismatchDetails.map((detail) => (
                      <li key={`${detail.playerId}-${detail.assignedRole}`}>
                        {detail.playerName}: 割当{' '}
                        {getRoleLabel(detail.assignedRole)} / 希望{' '}
                        {detail.desiredRoles.map(getRoleLabel).join(', ')}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <div className="mb-3 border-b border-slate-200 pb-1 font-bold">
                    レーン
                  </div>
                  {roleList.map((lane) => (
                    <div key={lane} className="mb-2 font-medium text-slate-700">
                      {lane}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="mb-3 border-b border-blue-100 pb-1 text-xl font-bold text-blue-500">
                    青チーム
                  </div>
                  {roleList.map((lane, index) => (
                    <div key={lane} className="mb-2">
                      {activeBalancedTeam.players[index].name || 'N/A'} (
                      {activeBalancedTeam.players[index].rating})
                    </div>
                  ))}
                </div>
                <div>
                  <div className="mb-3 border-b border-red-100 pb-1 text-xl font-bold text-red-500">
                    赤チーム
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

          {activeBalancedTeam.players.length !== 10 && (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
              まだ分割結果がありません。10人揃えたうえで「チーム分け」を実行してください。
            </div>
          )}

          {activeBalancedTeam.players.length === 10 && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="mb-2 text-sm font-semibold text-slate-700">
                試合結果の確定
              </p>
              <div className="mb-2 flex flex-wrap gap-2">
                <button
                  className={`rounded px-3 py-1 text-sm ${
                    selectedWinner === 'blue'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                  onClick={() => setSelectedWinner('blue')}
                >
                  青チーム勝利
                </button>
                <button
                  className={`rounded px-3 py-1 text-sm ${
                    selectedWinner === 'red'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-100 text-red-700'
                  }`}
                  onClick={() => setSelectedWinner('red')}
                >
                  赤チーム勝利
                </button>
                <button
                  className={`rounded px-3 py-1 text-sm ${
                    selectedWinner
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'cursor-not-allowed bg-gray-300 text-gray-500'
                  }`}
                  onClick={handleConfirmResult}
                  disabled={!selectedWinner}
                >
                  結果を確定
                </button>
              </div>
              {resultStatusMessage && (
                <p className="text-sm text-slate-700">{resultStatusMessage}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-slate-300 bg-white p-4">
        <h3 className="mb-2 text-base font-bold">試合履歴</h3>
        <MatchHistoryPanel
          histories={teamBalancer.matchHistories}
          selectedHistoryId={selectedHistoryId}
          onDeleteHistory={handleDeleteHistory}
          onToggleHistory={handleToggleHistory}
        />
      </div>
    </div>
  )
}

export default DividedTeamTable
