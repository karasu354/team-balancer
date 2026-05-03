import React from 'react'

import { MatchHistory } from '../utils/teamBalancer'
import MatchHistoryAccordion from './MatchHistoryAccordion'

interface MatchHistoryPanelProps {
  histories: MatchHistory[]
  selectedHistoryId: string | null
  onDeleteHistory: (historyId: string) => void
  onToggleHistory: (historyId: string) => void
}

const formatPlayedAt = (playedAt: string): string => {
  const date = new Date(playedAt)
  if (Number.isNaN(date.getTime())) {
    return playedAt
  }

  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const MatchHistoryPanel: React.FC<MatchHistoryPanelProps> = ({
  histories,
  selectedHistoryId,
  onDeleteHistory,
  onToggleHistory,
}) => {
  if (histories.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
        まだ試合履歴はありません。分割結果で勝敗を確定すると履歴が追加されます。
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-300 bg-slate-100">
      <div
        data-testid="match-history-list"
        className="max-h-80 divide-y divide-slate-200 overflow-y-auto"
      >
        {histories.map((history) => {
          const rowToneClass =
            history.winnerTeam === 'blue'
              ? 'border-l-blue-500 bg-blue-50/80 hover:bg-blue-100/70'
              : 'border-l-rose-500 bg-rose-50/80 hover:bg-rose-100/70'
          const badgeToneClass =
            history.winnerTeam === 'blue'
              ? 'bg-blue-600 text-white'
              : 'bg-rose-600 text-white'

          return (
            <div key={history.id}>
              <button
                data-testid="match-history-row"
                onClick={() => onToggleHistory(history.id)}
                className={`block w-full border-l-4 px-3 py-2 text-left text-xs text-slate-700 transition-colors ${rowToneClass}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-[11px] font-bold ${badgeToneClass}`}
                    >
                      {history.winnerTeam === 'blue'
                        ? '青チーム勝利'
                        : '赤チーム勝利'}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {formatPlayedAt(history.playedAt)}
                    </span>
                  </div>
                </div>
              </button>

              {selectedHistoryId === history.id && (
                <MatchHistoryAccordion
                  history={history}
                  onDeleteHistory={onDeleteHistory}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MatchHistoryPanel
