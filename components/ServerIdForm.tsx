import React, { useState } from 'react'

import { getTeamData, setTeamData } from '../composable/api'
import { TeamBalancer } from '../utils/teamBalancer'

interface ServerIdFormProps {
  teamBalancer: TeamBalancer
  onUpdateTeamBalancer: (teamBalancer: TeamBalancer) => void
  onAppUpdate: () => void
}

const ServerIdForm: React.FC<ServerIdFormProps> = ({
  teamBalancer,
  onUpdateTeamBalancer,
  onAppUpdate,
}) => {
  const [serverId, setServerId] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleFetchTeamData = async () => {
    if (!serverId.trim()) return

    setIsLoading(true)
    try {
      const teamData = await getTeamData(serverId)
      if (teamData) {
        onUpdateTeamBalancer(TeamBalancer.fromJson(teamData))
      } else {
        alert('チームデータが見つかりませんでした。')
      }
    } catch (error) {
      alert('チームデータの取得に失敗しました。')
    } finally {
      setTimeout(() => setIsLoading(false), 2000)
    }
  }

  const handleSaveTeamData = async () => {
    if (!serverId.trim()) return

    setIsLoading(true)
    try {
      const playersInfo = teamBalancer.playersInfo
      await setTeamData(serverId, playersInfo)
      alert('チームデータを保存しました。')
    } catch (error) {
      alert('チームデータの保存に失敗しました。')
    } finally {
      setTimeout(() => setIsLoading(false), 2000)
    }
  }

  return (
    <div className="mb-4 flex items-center space-x-4">
      <input
        type="text"
        placeholder="サーバーIDを入力"
        value={serverId}
        onChange={(e) => setServerId(e.target.value)}
        className="w-96 rounded border p-2"
      />

      <button
        onClick={handleFetchTeamData}
        disabled={!serverId.trim() || isLoading}
        className={`rounded px-4 py-2 ${
          !serverId.trim() || isLoading
            ? 'cursor-not-allowed bg-gray-400 text-gray-700'
            : 'bg-blue-500 text-white transition hover:bg-blue-600'
        }`}
      >
        {isLoading ? '読み込み中...' : '呼び出し'}
      </button>

      <button
        onClick={handleSaveTeamData}
        disabled={!serverId.trim() || isLoading}
        className={`rounded px-4 py-2 ${
          !serverId.trim() || isLoading
            ? 'cursor-not-allowed bg-gray-400 text-gray-700'
            : 'bg-green-500 text-white transition hover:bg-green-600'
        }`}
      >
        {isLoading ? '保存中...' : '保存'}
      </button>
    </div>
  )
}

export default ServerIdForm
