import React, { useState } from 'react'

import { Player } from '../utils/player'
import { rankEnum, tierEnum } from '../utils/rank'
import { TeamBalancer } from '../utils/teamBalancer'
import ChatLogInputForm from './ChatLogInputForm'
import PlayerCard from './PlayerCard'
import PlayerInputForm from './PlayerInputForm'
import ServerIdForm from './ServerIdForm'

interface PlayersTableProps {
  teamBalancer: TeamBalancer
  onPlayersUpdate: () => void
}

const PlayersTable: React.FC<PlayersTableProps> = ({
  teamBalancer,
  onPlayersUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single')
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const players = teamBalancer.players

  const handleAddPlayer = (name: string, tier: tierEnum, rank: rankEnum) => {
    try {
      if (editingPlayer === null) {
        const newPlayer = new Player(name)
        newPlayer.setRank(tier, rank)
        teamBalancer.addPlayer(newPlayer)
      } else {
        editingPlayer.setRank(tier, rank)
        setEditingPlayer(null)
      }
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
    player.setDesiredRoleByIndex(roleIndex)
    onPlayersUpdate()
  }

  const handleToggleRoleFixed = (player: Player) => {
    player.isRoleFixed = !player.isRoleFixed
    onPlayersUpdate()
  }

  const handleToggleParticipation = (player: Player) => {
    player.isParticipatingInGame = !player.isParticipatingInGame
    onPlayersUpdate()
  }

  const handleRemovePlayer = (index: number) => {
    try {
      const playerToRemove = players[index]
      teamBalancer.removePlayerByIndex(index)

      if (editingPlayer === playerToRemove) {
        setEditingPlayer(null)
      }

      onPlayersUpdate()
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('An unknown error occurred')
      }
    }
  }

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player)
    setActiveTab('single')
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-4 flex">
        <button
          onClick={() => setActiveTab('single')}
          className={`px-4 py-2 rounded ${
            activeTab === 'single'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          1人ずつ追加
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`px-4 py-2 rounded ${
            activeTab === 'bulk'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          まとめて追加
        </button>
      </div>

      <div className="h-48">
        {activeTab === 'single' ? (
          <PlayerInputForm
            onAddPlayer={handleAddPlayer}
            editingPlayer={editingPlayer}
          />
        ) : (
          <ChatLogInputForm
            teamDivider={teamBalancer}
            onPlayersUpdate={onPlayersUpdate}
          />
        )}
      </div>

      <ServerIdForm
        teamBalancer={teamBalancer}
        onPlayersUpdate={onPlayersUpdate}
      />

      <div className="grid grid-cols-2 gap-0 w-full border border-gray-300 rounded-lg">
        {players.map((player, index) => (
          <PlayerCard
            key={index}
            player={player}
            onToggleRole={(roleIndex) =>
              player && handleToggleRole(player, roleIndex)
            }
            onRemove={() => handleRemovePlayer(index)}
            onEdit={() => player && handleEditPlayer(player)}
          />
        ))}
      </div>
    </div>
  )
}

export default PlayersTable
