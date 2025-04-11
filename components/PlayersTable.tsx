import React from 'react'

import { Player } from '../utils/player'
import { TeamDivider } from '../utils/team-divider'
import PlayerCard from './PlayerCard'

interface PlayersTableProps {
  teamDivider: TeamDivider
  onPlayersUpdate: () => void
}

const PlayersTable: React.FC<PlayersTableProps> = ({
  teamDivider,
  onPlayersUpdate,
}) => {
  const players = teamDivider.getPlayers()

  const handleAddPlayer = (name: string, tag: string) => {
    try {
      const newPlayer = new Player(name, tag)
      teamDivider.addPlayer(newPlayer)
      onPlayersUpdate()
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('An unknown error occurred')
      }
    }
  }

  const handleToggleRole = (player: Player, roleIndex: number) => {
    player.setRole(roleIndex)
    onPlayersUpdate()
  }

  const handleRemovePlayer = (index: number) => {
    try {
      teamDivider.removePlayer(index)
      onPlayersUpdate()
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('An unknown error occurred')
      }
    }
  }

  // プレイヤーを縦並びから横並びに変換
  const reorderedPlayers = []
  for (let i = 0; i < 5; i++) {
    reorderedPlayers.push(players[2 * i], players[2 * i + 1])
  }

  return (
    <div className="grid grid-cols-2 gap-0 w-full max-w-4xl border border-gray-300 rounded-lg">
      {reorderedPlayers.map((player, index) => (
        <PlayerCard
          key={index}
          player={player}
          onToggleRole={
            player
              ? (roleIndex) => handleToggleRole(player, roleIndex)
              : undefined
          }
          onRemove={player ? () => handleRemovePlayer(index) : undefined}
          onAddPlayer={!player ? handleAddPlayer : undefined}
        />
      ))}
    </div>
  )
}

export default PlayersTable
