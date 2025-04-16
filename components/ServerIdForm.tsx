import React, { useState } from 'react'

import { getTeamData, setTeamData } from '../composable/api'
import { TeamBalancer } from '../utils/teamBalancer'

interface ServerIdFormProps {
  teamBalancer: TeamBalancer
  onPlayersUpdate: () => void
}

const ServerIdForm: React.FC<ServerIdFormProps> = ({
  teamBalancer,
  onPlayersUpdate,
}) => {
  const [serverId, setServerId] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleFetchTeamData = async () => {
    if (!serverId.trim()) return

    setIsLoading(true)
    try {
      const teamData = await getTeamData(serverId)
      if (teamData) {
        teamBalancer.setPlayersFromPlayersJson(teamData)
        onPlayersUpdate()
      } else {
        alert('チームデータが見つかりませんでした。')
      }
    } catch (error) {
      console.error('Error fetching team data:', error)
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
      console.error('Error saving team data:', error)
      alert('チームデータの保存に失敗しました。')
    } finally {
      setTimeout(() => setIsLoading(false), 2000)
    }
  }

  return (
    <div className="flex items-center space-x-4 mb-4">
      <input
        type="text"
        placeholder="サーバーIDを入力"
        value={serverId}
        onChange={(e) => setServerId(e.target.value)}
        className="p-2 border rounded w-96"
      />

      <button
        onClick={handleFetchTeamData}
        disabled={!serverId.trim() || isLoading}
        className={`px-4 py-2 rounded ${
          !serverId.trim() || isLoading
            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600 transition'
        }`}
      >
        {isLoading ? '読み込み中...' : '呼び出し'}
      </button>

      <button
        onClick={handleSaveTeamData}
        disabled={!serverId.trim() || isLoading}
        className={`px-4 py-2 rounded ${
          !serverId.trim() || isLoading
            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
            : 'bg-green-500 text-white hover:bg-green-600 transition'
        }`}
      >
        {isLoading ? '保存中...' : '保存'}
      </button>
    </div>
  )
}

export default ServerIdForm
