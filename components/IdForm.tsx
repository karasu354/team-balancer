import React, { useEffect, useState } from 'react'

import { getTeamData, setTeamData } from '../composable/api'
import { TeamBalancer } from '../utils/teamBalancer'

interface IdFormProps {
  activeTeamId: string
  teamBalancer: TeamBalancer
  onUpdateTeamBalancer: (teamBalancer: TeamBalancer) => void
  onActiveTeamIdChange: (teamId: string) => void
  onAppUpdate: () => void
}

const IdForm: React.FC<IdFormProps> = ({
  activeTeamId,
  teamBalancer,
  onUpdateTeamBalancer,
  onActiveTeamIdChange,
  onAppUpdate,
}) => {
  const [id, setId] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [isErrorStatus, setIsErrorStatus] = useState<boolean>(false)

  useEffect(() => {
    setId(activeTeamId)
  }, [activeTeamId])

  const handleFetchTeamData = async () => {
    if (!id.trim()) return

    setIsLoading(true)
    setStatusMessage('')
    setIsErrorStatus(false)
    try {
      const teamData = await getTeamData(id)
      if (teamData) {
        onUpdateTeamBalancer(TeamBalancer.fromJson(teamData))
        onActiveTeamIdChange(id)
        setStatusMessage('チームデータを読み込みました。')
      } else {
        setIsErrorStatus(true)
        setStatusMessage('チームデータが見つかりませんでした。')
      }
    } catch (error) {
      setIsErrorStatus(true)
      setStatusMessage('チームデータの取得に失敗しました。')
    } finally {
      setTimeout(() => setIsLoading(false), 2000)
    }
  }

  const handleSaveTeamData = async () => {
    if (!id.trim()) return

    setIsLoading(true)
    setStatusMessage('')
    setIsErrorStatus(false)
    try {
      const playersInfo = teamBalancer.playersInfo
      await setTeamData(id, playersInfo)
      onActiveTeamIdChange(id)
      setStatusMessage('チームデータを保存しました。')
    } catch (error) {
      setIsErrorStatus(true)
      setStatusMessage('チームデータの保存に失敗しました。')
    } finally {
      setTimeout(() => setIsLoading(false), 2000)
    }
  }

  return (
    <div className="w-full">
      <div className="flex w-full flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1">
          <label
            className="mb-1 block text-sm font-medium text-[var(--tb-text-primary)]"
            htmlFor="team-id-input"
          >
            チームID
          </label>
          <p className="mb-2 text-xs text-[var(--tb-text-secondary)]">
            チームの状態を保存・復元するためのID
          </p>
          <input
            id="team-id-input"
            type="text"
            placeholder="IDを入力"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full rounded border border-[var(--tb-border)] bg-[#0b1730] p-2 text-[var(--tb-text-primary)]"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleFetchTeamData}
            disabled={!id.trim() || isLoading}
            className={`rounded px-4 py-2 transition ${
              !id.trim() || isLoading
                ? 'cursor-not-allowed bg-slate-500 text-slate-300'
                : 'bg-[var(--tb-surface-muted)] text-[var(--tb-text-primary)] hover:brightness-110'
            }`}
          >
            {isLoading ? '読込中...' : '読み込む'}
          </button>

          <button
            onClick={handleSaveTeamData}
            disabled={!id.trim() || isLoading}
            className={`rounded px-4 py-2 transition ${
              !id.trim() || isLoading
                ? 'cursor-not-allowed bg-slate-500 text-slate-300'
                : 'bg-[var(--tb-accent)] text-white hover:bg-[var(--tb-accent-strong)]'
            }`}
          >
            {isLoading ? '保存中...' : '保存する'}
          </button>
        </div>
      </div>

      {statusMessage && (
        <p
          className={`mt-2 text-sm ${
            isErrorStatus ? 'text-red-300' : 'text-emerald-300'
          }`}
          aria-live="polite"
        >
          {statusMessage}
        </p>
      )}
    </div>
  )
}

export default IdForm
