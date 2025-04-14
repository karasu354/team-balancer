import React, { useState } from 'react'

import DividedTeamTable from '../components/DividedTeamTable'
import PlayersTable from '../components/PlayersTable'
import { TeamDivider } from '../utils/teamDivider'

const Home = () => {
  const [teamDivider] = useState(new TeamDivider())
  const [, setUpdate] = useState(0)

  const handlePlayersUpdate = () => {
    setUpdate((prev) => prev + 1)
  }

  const handleTeamsUpdate = () => {
    setUpdate((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 space-y-4">

      <h1 className="text-2xl font-bold">プレイヤー管理</h1>
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
