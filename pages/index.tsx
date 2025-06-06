import React, { useEffect, useState } from 'react'

import DividedTeamTable from '../components/DividedTeamTable'
import IdForm from '../components/IdForm'
import PlayerInputForm from '../components/PlayerInputForm'
import PlayersTable from '../components/PlayersTable'
import { TeamBalancer } from '../utils/teamBalancer'

const Home = () => {
  const [teamBalancer, setTeamBalancer] = useState<TeamBalancer>(
    new TeamBalancer()
  )
  const [_, setUpdate] = useState<number>(0)

  const handleAppUpdate = () => {
    setUpdate((prev) => prev + 1)
  }

  const handleRemovePlayer = (index: number) => {
    teamBalancer.removePlayerByIndex(index)
    handleAppUpdate()
  }

  const handleUpdateTeamBalancer = (newTeamBalancer: TeamBalancer) => {
    setTeamBalancer(newTeamBalancer)
    handleAppUpdate()
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 bg-gray-100 p-4 text-gray-900">
      <PlayerInputForm
        teamBalancer={teamBalancer}
        onAppUpdate={handleAppUpdate}
      />

      <IdForm
        teamBalancer={teamBalancer}
        onUpdateTeamBalancer={handleUpdateTeamBalancer}
        onAppUpdate={handleAppUpdate}
      />

      <PlayersTable
        teamBalancer={teamBalancer}
        onRemovePlayerByIndex={handleRemovePlayer}
        onAppUpdate={handleAppUpdate}
      />

      <DividedTeamTable
        teamBalancer={teamBalancer}
        onAppUpdate={handleAppUpdate}
      />
    </div>
  )
}

export default Home
