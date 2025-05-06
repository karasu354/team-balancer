import React, { useState } from 'react'

import { getTeamData, setTeamData } from '../composable/api'
import { TeamBalancer } from '../utils/teamBalancer'

interface IdFormProps {
  teamBalancer: TeamBalancer
  onUpdateTeamBalancer: (teamBalancer: TeamBalancer) => void
  onAppUpdate: () => void
}

const IdForm: React.FC<IdFormProps> = ({
  teamBalancer,
  onUpdateTeamBalancer,
  onAppUpdate,
}) => {
  const [id, setId] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleFetchTeamData = async () => {
    if (!id.trim()) return

    setIsLoading(true)
    try {
      const teamData = await getTeamData(id)
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
    if (!id.trim()) return

    setIsLoading(true)
    try {
      const playersInfo = teamBalancer.playersInfo
      await setTeamData(id, playersInfo)
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
        placeholder="Input ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="w-96 rounded border p-2"
      />

      <button
        onClick={handleFetchTeamData}
        disabled={!id.trim() || isLoading}
        className={`rounded px-4 py-2 ${
          !id.trim() || isLoading
            ? 'cursor-not-allowed bg-gray-400 text-gray-700'
            : 'bg-blue-500 text-white transition hover:bg-blue-600'
        }`}
      >
        {isLoading ? 'Loading...' : 'Import'}
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
        {isLoading ? 'Saving...' : 'Save'}
      </button>
    </div>
  )
}

export default IdForm
