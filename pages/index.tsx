import React, { useState } from 'react'

import DividedTeamTable from '../components/DividedTeamTable'
import PlayerInputForm from '../components/PlayerInputForm'
import PlayersTable from '../components/PlayersTable'
import ServerIdForm from '../components/ServerIdForm'
import { Player } from '../utils/player'
import { rankEnum, tierEnum } from '../utils/rank'
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

  const handleAddPlayer = (name: string, tier: tierEnum, rank: rankEnum) => {
    try {
      const newPlayer = new Player(name)
      newPlayer.setRank(tier, rank)
      teamBalancer.addPlayer(newPlayer)
      handlePlayersUpdate()
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('何かのエラーが出たけどエラーメッセージがわからん。')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 space-y-4">
      <h1 className="text-2xl font-bold">プレイヤー管理</h1>

      <PlayerInputForm
        teamBalancer={teamBalancer}
        onAddPlayer={handleAddPlayer}
        onPlayersUpdate={handlePlayersUpdate}
      />

      <ServerIdForm
        teamBalancer={teamBalancer}
        onPlayersUpdate={handlePlayersUpdate}
      />

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
