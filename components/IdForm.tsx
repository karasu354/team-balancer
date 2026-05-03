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
            className="mb-1 block text-sm font-medium text-slate-700"
            htmlFor="team-id-input"
          >
            チームID
          </label>
          <input
            id="team-id-input"
            type="text"
            placeholder="IDを入力"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full rounded border border-slate-300 bg-white p-2"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleFetchTeamData}
            disabled={!id.trim() || isLoading}
            className={`rounded px-4 py-2 ${
              !id.trim() || isLoading
                ? 'cursor-not-allowed bg-gray-400 text-gray-700'
                : 'bg-blue-500 text-white transition hover:bg-blue-600'
            }`}
          >
            {isLoading ? '読込中...' : '読み込む'}
          </button>

          <button
            onClick={handleSaveTeamData}
            disabled={!id.trim() || isLoading}
            className={`rounded px-4 py-2 ${
              !id.trim() || isLoading
                ? 'cursor-not-allowed bg-gray-400 text-gray-700'
                : 'bg-green-500 text-white transition hover:bg-green-600'
            }`}
          >
            {isLoading ? '保存中...' : '保存する'}
          </button>
        </div>
      </div>

      {statusMessage && (
        <p
          className={`mt-2 text-sm ${
            isErrorStatus ? 'text-red-600' : 'text-emerald-600'
          }`}
        >
          {statusMessage}
        </p>
      )}
    </div>
  )
}

export default IdForm
