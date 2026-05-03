import React from 'react'

import {
  MatchHistory,
  PlayerResult,
  TeamsSnapshotPlayer,
} from '../utils/teamBalancer'

interface MatchHistoryAccordionProps {
  history: MatchHistory
  isLoading?: boolean
  onDeleteHistory: (historyId: string) => void
}

interface TeamEntry {
  playerId: string
  playerName: string
  role: string
  result: string
  ratingAfter: number
  ratingDelta: number
}

const buildTeamEntries = (
  team: 'blue' | 'red',
  teamsSnapshot: TeamsSnapshotPlayer[],
  playerResults: PlayerResult[]
): TeamEntry[] => {
  return teamsSnapshot
    .filter((player) => player.team === team)
    .map((player) => {
      const result = playerResults.find(
        (entry) => entry.playerId === player.playerId
      )

      return {
        playerId: player.playerId,
        playerName: player.playerName,
        role: player.role,
        result: result?.result === 'win' ? '勝' : '敗',
        ratingAfter: result?.ratingAfter ?? 0,
        ratingDelta: result?.ratingDelta ?? 0,
      }
    })
}

const formatDelta = (delta: number): string => {
  return `${delta > 0 ? '+' : ''}${delta}`
}

const MatchHistoryAccordion: React.FC<MatchHistoryAccordionProps> = ({
  history,
  isLoading = false,
  onDeleteHistory,
}) => {
  const blueTeam = buildTeamEntries(
    'blue',
    history.teamsSnapshot,
    history.playerResults
  )
  const redTeam = buildTeamEntries(
    'red',
    history.teamsSnapshot,
    history.playerResults
  )

  return (
    <div
      data-testid="match-history-accordion"
      className="border-t border-[var(--tb-border)] bg-[var(--tb-surface)] px-4 py-4"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-[var(--tb-text-primary)]">
            履歴詳細
          </h4>
          <p className="text-xs text-[var(--tb-text-secondary)]">
            この履歴を削除すると、残存履歴をもとにレートを再計算します。
          </p>
        </div>
        <button
          onClick={() => onDeleteHistory(history.id)}
          disabled={isLoading}
          className={`rounded px-3 py-1 text-xs font-semibold transition ${
            isLoading
              ? 'cursor-not-allowed bg-[var(--tb-surface-muted)] text-[var(--tb-text-secondary)]'
              : 'bg-red-900/40 text-red-300 hover:bg-red-900/60'
          }`}
        >
          履歴を削除
        </button>
      </div>

      <div className="mb-3 grid gap-2 text-xs text-slate-600 md:grid-cols-3">
        <p>
          勝利チーム: {history.winnerTeam === 'blue' ? '青チーム' : '赤チーム'}
        </p>
        <p>ミスマッチ: {history.mismatchCount}</p>
        <p>対象人数: {history.playerResults.length}人</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded border border-blue-200 bg-blue-50 p-3">
          <p className="mb-2 font-semibold text-blue-700">青チーム</p>
          <div className="space-y-2">
            {blueTeam.map((player) => (
              <div
                key={player.playerId}
                className="flex items-center justify-between rounded bg-white px-2 py-2 text-sm"
              >
                <div>
                  <p className="font-medium text-slate-800">
                    {player.playerName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {player.role} / {player.result}
                  </p>
                </div>
                <span
                  className={`font-semibold ${
                    player.ratingDelta >= 0 ? 'text-blue-700' : 'text-red-600'
                  }`}
                >
                  {`${player.ratingAfter} (${formatDelta(player.ratingDelta)})`}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded border border-red-200 bg-red-50 p-3">
          <p className="mb-2 font-semibold text-red-700">赤チーム</p>
          <div className="space-y-2">
            {redTeam.map((player) => (
              <div
                key={player.playerId}
                className="flex items-center justify-between rounded bg-white px-2 py-2 text-sm"
              >
                <div>
                  <p className="font-medium text-slate-800">
                    {player.playerName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {player.role} / {player.result}
                  </p>
                </div>
                <span
                  className={`font-semibold ${
                    player.ratingDelta >= 0 ? 'text-blue-700' : 'text-red-600'
                  }`}
                >
                  {`${player.ratingAfter} (${formatDelta(player.ratingDelta)})`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MatchHistoryAccordion
