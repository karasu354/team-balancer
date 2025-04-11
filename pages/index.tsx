import React, { useState } from 'react'

import ChatLogInputForm from '../components/ChatLogInputForm'
import DividedTeamTable from '../components/DividedTeamTable'
import PlayersTable from '../components/PlayersTable'
import { TeamDivider } from '../utils/team-divider'

const Home = () => {
  const [teamDivider] = useState(new TeamDivider()) // TeamDividerのインスタンスを作成
  const [, setUpdate] = useState(0) // 再レンダリング用

  const handlePlayersUpdate = () => {
    setUpdate((prev) => prev + 1) // 状態を更新して再レンダリング
  }

  const handleTeamsUpdate = () => {
    setUpdate((prev) => prev + 1) // チーム分け後の再レンダリング
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 space-y-4">
      <h1 className="text-2xl font-bold">プレイヤー管理</h1>
      <ChatLogInputForm
        teamDivider={teamDivider}
        onPlayersUpdate={handlePlayersUpdate}
      />
      <PlayersTable
        teamDivider={teamDivider}
        onPlayersUpdate={handlePlayersUpdate}
      />
      <DividedTeamTable
        teamDivider={teamDivider}
        onTeamsUpdate={handleTeamsUpdate}
      />
    </div>
  )
}

export default Home
