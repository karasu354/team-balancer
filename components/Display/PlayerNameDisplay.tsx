import React from 'react'

import { Player } from '../../utils/player'

interface PlayerNameDisplayProps {
  player: Player
}

const PlayerNameDisplay: React.FC<PlayerNameDisplayProps> = ({ player }) => {
  return (
    <div className="mb-2">
      <p className="overflow-hidden font-bold text-ellipsis">{player.name}</p>
      <p className="text-xs">({player.displayRank})</p>
    </div>
  )
}

export default PlayerNameDisplay
