import React, { useState } from 'react'

import { deleteTeamHistory } from '../composable/api'
import { Player } from '../utils/player'
import { roleList } from '../utils/role'
import { TeamBalancer } from '../utils/teamBalancer'
import MatchHistoryPanel from './MatchHistoryPanel'
import Tabs from './Navigation/Tabs'

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

const getContributionWidthClass = (
  rating: number,
  maxRating: number
): string => {
  const percentage = Math.round((rating / maxRating) * 100)
  if (percentage >= 100) return 'w-full'
  if (percentage >= 90) return 'w-[90%]'
  if (percentage >= 80) return 'w-[80%]'
  if (percentage >= 70) return 'w-[70%]'
  if (percentage >= 60) return 'w-[60%]'
  if (percentage >= 50) return 'w-[50%]'
  if (percentage >= 40) return 'w-[40%]'
  if (percentage >= 30) return 'w-[30%]'
  if (percentage >= 20) return 'w-[20%]'
  if (percentage >= 10) return 'w-[10%]'
  return 'w-0'
}

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
  const [activeViewTab, setActiveViewTab] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDividing, setIsDividing] = useState<boolean>(false)
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
    setIsDividing(true)
    setSelectedWinner(null)
    setResultStatusMessage('新しいチームを計算中です...')
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      teamBalancer.divideTeams()
      setResultStatusMessage('チーム分けが完了しました。')
      onAppUpdate()
    } catch (error) {
      setResultStatusMessage(
        'チーム分けに失敗しました。プレイヤーが10人揃っているか確認してください。'
      )
    } finally {
      setIsDividing(false)
    }
  }

  const handleCopyToClipboard = () => {
    if (activeBalancedTeam.players.length !== 10) {
      setResultStatusMessage('コピー対象の分割結果がありません。')
      return
    }

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
    setResultStatusMessage('チーム結果をクリップボードにコピーしました。')
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

    const confirmed = window.confirm(
      `${selectedWinner === 'blue' ? '青' : '赤'}チーム勝利で確定します。よろしいですか？`
    )
    if (!confirmed) {
      return
    }

    try {
      teamBalancer.finalizeMatchResult(
        activeBalancedTeam.players,
        selectedWinner,
        activeTab
      )
      setResultStatusMessage('試合結果を確定し、履歴に保存しました。')
      setSelectedWinner(null)
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

    setIsLoading(true)
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
    } finally {
      setIsLoading(false)
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

  const blueTeam = activeBalancedTeam.players.slice(0, 5)
  const redTeam = activeBalancedTeam.players.slice(5, 10)
  const blueTotalRating = blueTeam.reduce(
    (sum, player) => sum + (player?.rating ?? 0),
    0
  )
  const redTotalRating = redTeam.reduce(
    (sum, player) => sum + (player?.rating ?? 0),
    0
  )
  const maxRating = Math.max(
    ...activeBalancedTeam.players.map((p) => p.rating),
    1
  )

  const handleContainerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Enter') {
      return
    }

    if (e.target !== e.currentTarget) {
      return
    }

    if (!isDividing && !isDivideButtonDisabled) {
      void handleDivideTeams()
    }
  }

  return (
    <div
      className="w-full"
      onKeyDown={handleContainerKeyDown}
      tabIndex={0}
      aria-label="チーム分割エリア"
    >
      <div className="mb-3 rounded-lg border border-[var(--tb-border)] bg-[#0f1a34] px-3 py-2 text-sm text-[var(--tb-text-secondary)]">
        分割条件: 参加中プレイヤー 10人（現在 {participatingPlayersCount}/10）
      </div>

      <div className="mb-4 flex flex-wrap justify-center gap-2 md:justify-start">
        <button
          onClick={handleDivideTeams}
          disabled={isDividing || isDivideButtonDisabled}
          className={`rounded px-4 py-2 transition ${
            isDividing || isDivideButtonDisabled
              ? 'cursor-not-allowed bg-slate-500 text-slate-300'
              : 'bg-[var(--tb-accent)] text-white hover:bg-[var(--tb-accent-strong)]'
          }`}
        >
          {isDividing ? 'チーム分け中...' : 'チーム分け'}
        </button>
        <button
          onClick={handleCopyToClipboard}
          disabled={activeBalancedTeam.players.length === 0 || isDividing}
          className={`rounded px-4 py-2 transition ${
            activeBalancedTeam.players.length === 0 || isDividing
              ? 'cursor-not-allowed bg-slate-500 text-slate-300'
              : 'bg-[var(--tb-surface-muted)] text-[var(--tb-text-primary)] hover:brightness-110'
          }`}
        >
          クリップボードにコピー
        </button>
      </div>

      <p className="mb-3 text-xs text-[var(--tb-text-secondary)]">
        キーボード操作: 分割エリアにフォーカスして Enter
        を押すとチーム分けを実行します。
      </p>

      <div className="mb-3">
        <Tabs
          labels={['分割結果', '履歴']}
          activeTab={activeViewTab}
          onActiveTab={setActiveViewTab}
        />
      </div>

      <div className="min-h-[30rem] md:min-h-[38rem]">
        {activeViewTab === 0 && (
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex gap-2 overflow-x-auto pb-1 md:mr-2 md:flex-col md:gap-2 md:overflow-visible md:pb-0">
              {scoreSummaries.length > 0 && (
                <div className="mb-2 rounded border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
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
                  {balancedTeamsByMissMatch[Number(key)].players.length ===
                    10 &&
                    ` (${balancedTeamsByMissMatch[Number(key)].evaluationScore.toFixed(2)})`}
                </button>
              ))}
            </div>

            <div className="flex-1 rounded-lg border border-[var(--tb-border)] bg-[var(--tb-surface)] p-4">
              {isDividing ? (
                <div className="rounded-lg border border-[var(--tb-border)] bg-[#0f1a34] px-4 py-10 text-center text-sm text-[var(--tb-text-secondary)]">
                  新しいチームを計算中です。結果を更新しています...
                </div>
              ) : (
                activeBalancedTeam.players.length === 10 && (
                  <div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      <p className="rounded-full border border-[var(--tb-border)] bg-[#0b1730] px-3 py-1 text-sm text-[var(--tb-text-secondary)]">
                        評価スコア:{' '}
                        <span className="font-semibold text-[var(--tb-text-primary)]">
                          {activeBalancedTeam.evaluationScore.toFixed(2)}
                        </span>
                      </p>
                      <p className="rounded-full border border-[var(--tb-border)] bg-[#0b1730] px-3 py-1 text-sm text-[var(--tb-text-secondary)]">
                        チーム総レート差:{' '}
                        <span className="font-semibold text-[var(--tb-text-primary)]">
                          {Math.abs(blueTotalRating - redTotalRating)}
                        </span>
                      </p>
                    </div>
                    <div className="mb-3 rounded border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
                      <p className="font-semibold text-amber-200">
                        ミスマッチ内訳（
                        {activeBalancedTeam.mismatchDetails.length}
                        件）
                      </p>
                      {activeBalancedTeam.mismatchDetails.length === 0 ? (
                        <p className="mt-1 text-amber-100">
                          ミスマッチはありません（全員が希望ロールに配置されています）。
                        </p>
                      ) : (
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-amber-100">
                          {activeBalancedTeam.mismatchDetails.map((detail) => (
                            <li
                              key={`${detail.playerId}-${detail.assignedRole}`}
                            >
                              {detail.playerName}: 割当{' '}
                              {getRoleLabel(detail.assignedRole)} / 希望{' '}
                              {detail.desiredRoles.map(getRoleLabel).join(', ')}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3">
                        <div className="mb-3 border-b border-blue-500/20 pb-2">
                          <p className="text-xl font-bold text-blue-300">
                            青チーム
                          </p>
                          <p className="text-xs text-blue-100">
                            総レート: {blueTotalRating}
                          </p>
                        </div>
                        <div className="space-y-2">
                          {roleList.map((lane, index) => (
                            <div
                              key={lane}
                              className="rounded border border-blue-400/20 bg-[#0c1a35] p-2"
                            >
                              <div className="mb-1 flex items-center justify-between text-xs">
                                <span className="font-semibold text-blue-200">
                                  {lane}
                                </span>
                                <span className="text-blue-100">
                                  {blueTeam[index]?.rating ?? 'N/A'}
                                </span>
                              </div>
                              <p className="text-sm font-semibold text-[var(--tb-text-primary)]">
                                {blueTeam[index]?.name || 'N/A'}
                              </p>
                              <div className="mt-1 h-1.5 rounded-full bg-blue-950/70">
                                <div
                                  className={`h-1.5 rounded-full bg-blue-400 ${getContributionWidthClass(
                                    blueTeam[index]?.rating ?? 0,
                                    maxRating
                                  )}`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                        <div className="mb-3 border-b border-red-500/20 pb-2">
                          <p className="text-xl font-bold text-red-300">
                            赤チーム
                          </p>
                          <p className="text-xs text-red-100">
                            総レート: {redTotalRating}
                          </p>
                        </div>
                        <div className="space-y-2">
                          {roleList.map((lane, index) => (
                            <div
                              key={lane}
                              className="rounded border border-red-400/20 bg-[#0c1a35] p-2"
                            >
                              <div className="mb-1 flex items-center justify-between text-xs">
                                <span className="font-semibold text-red-200">
                                  {lane}
                                </span>
                                <span className="text-red-100">
                                  {redTeam[index]?.rating ?? 'N/A'}
                                </span>
                              </div>
                              <p className="text-sm font-semibold text-[var(--tb-text-primary)]">
                                {redTeam[index]?.name || 'N/A'}
                              </p>
                              <div className="mt-1 h-1.5 rounded-full bg-red-950/70">
                                <div
                                  className={`h-1.5 rounded-full bg-red-400 ${getContributionWidthClass(
                                    redTeam[index]?.rating ?? 0,
                                    maxRating
                                  )}`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}

              {!isDividing && activeBalancedTeam.players.length !== 10 && (
                <div className="rounded-lg border border-dashed border-[var(--tb-border)] bg-[#0f1a34] px-4 py-8 text-center text-sm text-[var(--tb-text-secondary)]">
                  まだ分割結果がありません。10人揃えたうえで「チーム分け」を実行してください。
                </div>
              )}

              {!isDividing && activeBalancedTeam.players.length === 10 && (
                <div className="mt-4 rounded-lg border border-[var(--tb-border)] bg-[#0f1a34] p-3">
                  <p className="mb-2 text-sm font-semibold text-[var(--tb-text-primary)]">
                    試合結果の確定
                  </p>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <button
                      className={`rounded px-3 py-1 text-sm ${
                        selectedWinner === 'blue'
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-500/20 text-blue-200'
                      }`}
                      onClick={() => setSelectedWinner('blue')}
                    >
                      青チーム勝利
                    </button>
                    <button
                      className={`rounded px-3 py-1 text-sm ${
                        selectedWinner === 'red'
                          ? 'bg-red-600 text-white'
                          : 'bg-red-500/20 text-red-200'
                      }`}
                      onClick={() => setSelectedWinner('red')}
                    >
                      赤チーム勝利
                    </button>
                    <button
                      className={`rounded px-3 py-1 text-sm ${
                        selectedWinner
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'cursor-not-allowed bg-gray-400 text-gray-700'
                      }`}
                      onClick={handleConfirmResult}
                      disabled={!selectedWinner}
                    >
                      結果を確定
                    </button>
                  </div>
                  {resultStatusMessage && (
                    <p
                      className="text-sm text-[var(--tb-text-secondary)]"
                      aria-live="polite"
                    >
                      {resultStatusMessage}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeViewTab === 1 && (
          <div className="mt-1 rounded-lg border border-[var(--tb-border)] bg-[var(--tb-surface)] p-4">
            <h3 className="mb-2 text-base font-bold">試合履歴</h3>
            <MatchHistoryPanel
              histories={teamBalancer.matchHistories}
              selectedHistoryId={selectedHistoryId}
              isLoading={isLoading}
              onDeleteHistory={handleDeleteHistory}
              onToggleHistory={handleToggleHistory}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default DividedTeamTable
