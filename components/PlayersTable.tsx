import React, { useEffect, useState } from 'react'

import { Player } from '../utils/player'
import { TeamBalancer } from '../utils/teamBalancer'
import PlayerCard from './PlayerCard'

interface PlayersTableProps {
  teamBalancer: TeamBalancer
  onPlayersUpdate: () => void
}

const PlayersTable: React.FC<PlayersTableProps> = ({
  teamBalancer,
  onPlayersUpdate,
}) => {
  const players = teamBalancer.players
  const [isExpandedList, setIsExpandedList] = useState<boolean[]>([])

  useEffect(() => {
    setIsExpandedList(Array(players.length).fill(false))
  }, [players.length])

  const handleToggleExpand = (index: number) => {
    setIsExpandedList((prev) =>
      prev.map((isExpanded, i) => (i === index ? !isExpanded : isExpanded))
    )
    onPlayersUpdate()
  }

  const handleRemovePlayer = (index: number) => {
    try {
      teamBalancer.removePlayerByIndex(index)
      setIsExpandedList((prev) => prev.filter((_, i) => i !== index))
      onPlayersUpdate()
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('An unknown error occurred')
      }
    }
  }

  const handleToggleParticipating = (index: number) => {
    players[index].isParticipatingInGame = !players[index].isParticipatingInGame
    onPlayersUpdate()
  }

  const handleToggleRole = (player: Player, roleIndex: number) => {
    player.setDesiredRoleByIndex(roleIndex)
    onPlayersUpdate()
  }

  return (
    <div className="grid grid-cols-2 gap-0 w-full border border-gray-300 rounded-lg">
      {players.map((player, index) => (
        <PlayerCard
          key={index}
          player={player}
          isExpanded={isExpandedList[index]}
          onPlayersUpdate={onPlayersUpdate}
          onToggleExpand={() => handleToggleExpand(index)}
          onToggleRole={(roleIndex) => handleToggleRole(player, roleIndex)}
          onRemove={() => handleRemovePlayer(index)}
          onToggleParticipating={() => handleToggleParticipating(index)}
        />
      ))}
    </div>
  )
}

export default PlayersTable
