import React, { useState } from 'react'

import { Player } from '../utils/player'
import { rankEnum, tierEnum } from '../utils/rank'
import { TeamDivider } from '../utils/teamDivider'
import ChatLogInputForm from './ChatLogInputForm'
import PlayerCard from './PlayerCard'
import PlayerInputForm from './PlayerInputForm'

interface PlayersTableProps {
  teamDivider: TeamDivider
  onPlayersUpdate: () => void
}

const PlayersTable: React.FC<PlayersTableProps> = ({
  teamDivider,
  onPlayersUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single') // タブの状態管理
  const players = teamDivider.getPlayers()

  const handleAddPlayer = (
    name: string,
    tag: string,
    tier: tierEnum,
    rank: rankEnum
  ) => {
    try {
      const newPlayer = new Player(name, tag)
      newPlayer.setRank(tier, rank) // ティアとランクを設定
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

  return (
    <div className="w-full max-w-4xl">
      {/* タブ切り替え */}
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

      {/* タブの内容 */}
      <div className="h-48">
        {' '}
        {/* 高さを固定 */}
        {activeTab === 'single' ? (
          <PlayerInputForm onAddPlayer={handleAddPlayer} />
        ) : (
          <ChatLogInputForm
            teamDivider={teamDivider}
            onPlayersUpdate={onPlayersUpdate}
          />
        )}
      </div>

      {/* プレイヤー一覧 */}
      <div className="grid grid-cols-2 gap-0 w-full border border-gray-300 rounded-lg">
        {players.map((player, index) => (
          <PlayerCard
            key={index}
            player={player}
            onToggleRole={(roleIndex) =>
              player && handleToggleRole(player, roleIndex)
            }
            onRemove={() => handleRemovePlayer(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default PlayersTable
