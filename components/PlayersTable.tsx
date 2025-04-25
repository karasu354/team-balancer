import React, { useEffect, useState } from 'react'

import { Player } from '../utils/player'
import { TeamBalancer } from '../utils/teamBalancer'
import PlayerCard from './PlayerCard'

interface PlayersTableProps {
  teamBalancer: TeamBalancer
  onRemovePlayerByIndex: (index: number) => void
  onAppUpdate: () => void
}

const PlayersTable: React.FC<PlayersTableProps> = ({
  teamBalancer,
  onRemovePlayerByIndex,
  onAppUpdate,
}) => {
  const players = teamBalancer.players
  const [isExpandedList, setIsExpandedList] = useState<boolean[]>([])

  useEffect(() => {
    setIsExpandedList(Array(players.length).fill(false))
  }, [players.length])

  const handleToggleExpand = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    setIsExpandedList((prev) =>
      prev.map((isExpanded, i) => (i === index ? !isExpanded : isExpanded))
    )
    onAppUpdate()
  }

  const handleUpdatePlayer = (index: number, updatedPlayer: Player) => {
    try {
      teamBalancer.players[index] = updatedPlayer
      onAppUpdate()
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('An unknown error occurred')
      }
    }
  }

  return (
    <div className="grid grid-cols-2">
      {players.map((player, index) => (
        <PlayerCard
          key={index}
          player={player}
          isExpanded={isExpandedList[index]}
          onToggleExpand={(e: React.MouseEvent) => handleToggleExpand(e, index)}
          onCurrentPlayerUpdate={(updatedPlayer) =>
            handleUpdatePlayer(index, updatedPlayer)
          }
          onRemove={() => onRemovePlayerByIndex(index)}
        />
      ))}
    </div>
  )
}

export default PlayersTable
