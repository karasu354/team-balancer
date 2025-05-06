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
  const [isEditModeList, setIsEditModeList] = useState<boolean[]>([])
  const [isDeleteModeList, setIsDeleteModeList] = useState<boolean[]>([])

  useEffect(() => {
    setIsExpandedList(Array(players.length).fill(false))
    setIsEditModeList(Array(players.length).fill(false))
    setIsDeleteModeList(Array(players.length).fill(false))
  }, [players.length])

  const handleToggleExpand = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    setIsExpandedList((prev) =>
      prev.map((isExpanded, i) => (i === index ? !isExpanded : isExpanded))
    )
    onAppUpdate()
  }

  const handleToggleEditMode = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    setIsEditModeList((prev) =>
      prev.map((isEditMode, i) => (i === index ? !isEditMode : isEditMode))
    )
  }

  const handleToggleDeleteMode = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    setIsDeleteModeList((prev) =>
      prev.map((isDeleteMode, i) =>
        i === index ? !isDeleteMode : isDeleteMode
      )
    )
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
    <div className="grid grid-cols-2 gap-1">
      {players.map((player, index) => (
        <PlayerCard
          key={index}
          player={player}
          isExpanded={isExpandedList[index]}
          isEditMode={isEditModeList[index]}
          isDeleteMode={isDeleteModeList[index]}
          onToggleExpand={(e: React.MouseEvent) => handleToggleExpand(e, index)}
          onEditModeToggle={(e: React.MouseEvent) =>
            handleToggleEditMode(e, index)
          }
          onDeleteModeToggle={(e: React.MouseEvent) =>
            handleToggleDeleteMode(e, index)
          }
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
