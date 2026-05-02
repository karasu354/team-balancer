import React, { useEffect, useState } from 'react'

import { Player } from '../utils/player'
import { TeamBalancer } from '../utils/teamBalancer'
import BulkEditRow from './BulkEditRow'
import Tabs from './Navigation/Tabs'
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
  const participatingPlayersCount = players.filter(
    (player) => player.isParticipatingInGame
  ).length
  const [isExpandedList, setIsExpandedList] = useState<boolean[]>([])
  const [isEditModeList, setIsEditModeList] = useState<boolean[]>([])
  const [isDeleteModeList, setIsDeleteModeList] = useState<boolean[]>([])
  const [activeTab, setActiveTab] = useState<number>(0)
  const [draftPlayers, setDraftPlayers] = useState<Player[]>([])
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const [savedMessage, setSavedMessage] = useState<string>('')

  useEffect(() => {
    setIsExpandedList(Array(players.length).fill(false))
    setIsEditModeList(Array(players.length).fill(false))
    setIsDeleteModeList(Array(players.length).fill(false))
  }, [players.length])

  // Bulk Edit タブに切り替わったとき、または players が変わったときに下書きを初期化する
  useEffect(() => {
    if (activeTab === 1) {
      setDraftPlayers(
        players.map((p) => {
          const copy = Player.fromJson(p.playerInfo)
          copy.isParticipatingInGame = p.isParticipatingInGame
          return copy
        })
      )
      setIsDirty(false)
      setSavedMessage('')
    }
  }, [activeTab, players.length])

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

  const handleToggleParticipation = (index: number) => {
    teamBalancer.players[index].isParticipatingInGame =
      !teamBalancer.players[index].isParticipatingInGame
    onAppUpdate()
  }

  const handleDraftChange = (index: number, updated: Player) => {
    setDraftPlayers((prev) => prev.map((p, i) => (i === index ? updated : p)))
    setIsDirty(true)
    setSavedMessage('')
  }

  const handleDraftRemove = (index: number) => {
    onRemovePlayerByIndex(index)
  }

  const handleSaveAll = () => {
    draftPlayers.forEach((draft, index) => {
      if (index < teamBalancer.players.length) {
        teamBalancer.players[index] = draft
      }
    })
    setIsDirty(false)
    setSavedMessage('保存しました')
    setTimeout(() => setSavedMessage(''), 2000)
    onAppUpdate()
  }

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2">
        <p className="text-sm text-slate-600">
          Total:{' '}
          <span className="font-semibold text-slate-900">{players.length}</span>
        </p>
        <p className="text-sm text-slate-600">
          Participating:{' '}
          <span className="font-semibold text-slate-900">
            {participatingPlayersCount}/10
          </span>
        </p>
      </div>

      <div className="mb-3">
        <Tabs
          labels={['Cards', 'Bulk Edit']}
          activeTab={activeTab}
          onActiveTab={setActiveTab}
        />
      </div>

      {players.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
          プレイヤーがまだ登録されていません。入力フォームから追加するか、サンプルデータを投入してください。
        </div>
      ) : (
        <>
          {activeTab === 0 ? (
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
              {players.map((player, index) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isExpanded={isExpandedList[index]}
                  isEditMode={isEditModeList[index]}
                  isDeleteMode={isDeleteModeList[index]}
                  onToggleExpand={(e: React.MouseEvent) =>
                    handleToggleExpand(e, index)
                  }
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
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-slate-500">
                Bulk Edit では全プレイヤーをまとめて編集できます。編集後に「Save
                All」で確定してください。
              </p>
              {draftPlayers.map((player, index) => (
                <BulkEditRow
                  key={player.id}
                  player={player}
                  onChange={(updated) => handleDraftChange(index, updated)}
                  onRemove={() => handleDraftRemove(index)}
                />
              ))}
              {draftPlayers.length > 0 && (
                <div className="flex items-center justify-end gap-3 pt-2">
                  {savedMessage && (
                    <span className="text-sm text-emerald-600">
                      {savedMessage}
                    </span>
                  )}
                  <button
                    onClick={handleSaveAll}
                    disabled={!isDirty}
                    className={`rounded px-5 py-2 font-semibold text-white transition ${
                      isDirty
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'cursor-not-allowed bg-gray-300 text-gray-500'
                    }`}
                  >
                    Save All
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PlayersTable
