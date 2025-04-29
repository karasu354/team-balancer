import React, { useEffect, useState } from 'react'

import DividedTeamTable from '../components/DividedTeamTable'
import Tabs from '../components/Navigation/Tabs'
import PlayerInputForm from '../components/PlayerInputForm'
import PlayersTable from '../components/PlayersTable'
import ServerIdForm from '../components/ServerIdForm'
import { Player } from '../utils/player'
import { rankEnum, tierEnum } from '../utils/rank'
import { roleEnum } from '../utils/role'
import { TeamBalancer } from '../utils/teamBalancer'

const Home = () => {
  const [teamBalancer, setTeamBalancer] = useState<TeamBalancer>(
    new TeamBalancer()
  )
  const [updateCount, setUpdate] = useState<number>(0)

  useEffect(() => {
    console.log('count : ', updateCount)
  }, [updateCount])

  const handleAppUpdate = () => {
    setUpdate((prev) => prev + 1)
  }

  const handleAddPlayer = (
    name: string,
    tier: tierEnum,
    rank: rankEnum,
    mainRole: roleEnum,
    subRole: roleEnum
  ) => {
    const newPlayer = new Player(name, tier, rank, mainRole, subRole)
    teamBalancer.addPlayer(newPlayer)
    handleAppUpdate()
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
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-gray-100 p-4">
      <div className="w-100">
        <Tabs labels={['プレイヤー管理', 'サーバーID管理', 'uooo']} />
      </div>
      <h1 className="text-2xl font-bold">プレイヤー管理</h1>

      <PlayerInputForm
        teamBalancer={teamBalancer}
        onAddPlayer={handleAddPlayer}
        onAppUpdate={handleAppUpdate}
      />

      <ServerIdForm
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
