import React, { useState } from 'react'

import DividedTeamTable from '../components/DividedTeamTable'
import PlayersTable from '../components/PlayersTable'
import { TeamBalancer } from '../utils/teamBalancer'

const Home = () => {
  const [teamBalancer] = useState(new TeamBalancer())
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
        teamBalancer={teamBalancer}
        onPlayersUpdate={handlePlayersUpdate}
      />
      <DividedTeamTable
        teamBalancer={teamBalancer}
        onTeamsUpdate={handleTeamsUpdate}
      />
    </div>
  )
}

export default Home
