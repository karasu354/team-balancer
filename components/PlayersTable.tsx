import React, { useEffect, useState } from 'react'

import { Player } from '../utils/player'
import { TeamBalancer } from '../utils/teamBalancer'
import BulkEditRow from './BulkEditRow'
import Tabs from './Navigation/Tabs'
import PlayerDeleteCard from './PlayerDeleteCard'
import PlayerDetailCard from './PlayerDetailCard'
import PlayerEditCard from './PlayerEditCard'

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
      <div className="mb-3 flex items-center justify-between rounded-lg border border-[var(--tb-border)] bg-[#0f1a34] px-3 py-2">
        <p className="text-sm text-[var(--tb-text-secondary)]">
          合計:{' '}
          <span className="font-semibold text-[var(--tb-text-primary)]">
            {players.length}
          </span>
        </p>
        <p className="text-sm text-[var(--tb-text-secondary)]">
          参加中:{' '}
          <span className="font-semibold text-[var(--tb-text-primary)]">
            {participatingPlayersCount}/10
          </span>
        </p>
      </div>

      <div className="mb-3">
        <Tabs
          labels={['リスト表示', '一括編集']}
          activeTab={activeTab}
          onActiveTab={setActiveTab}
        />
      </div>

      {players.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--tb-border)] bg-[#0f1a34] px-4 py-8 text-center text-sm text-[var(--tb-text-secondary)]">
          プレイヤーがまだ登録されていません。入力フォームから追加するか、サンプルデータを投入してください。
        </div>
      ) : (
        <>
          {activeTab === 0 ? (
            <div className="overflow-hidden rounded-lg border border-[var(--tb-border)] bg-[#0f1a34]">
              <div className="max-h-96 space-y-0 overflow-y-auto">
                {players.map((player, index) => (
                  <div key={player.id}>
                    <div className="flex items-center border-b border-[var(--tb-border)]">
                      <button
                        onClick={() => {
                          player.isParticipatingInGame =
                            !player.isParticipatingInGame
                          handleUpdatePlayer(index, player)
                        }}
                        title="参加切替"
                        className="flex w-10 flex-shrink-0 items-center justify-center border-r border-[var(--tb-border)] bg-[var(--tb-surface-muted)] hover:brightness-125"
                      >
                        <span className="text-lg">
                          {player.isParticipatingInGame ? '☑' : '☐'}
                        </span>
                      </button>

                      <button
                        onClick={(e) => handleToggleExpand(e, index)}
                        className="flex flex-1 items-center justify-between gap-3 px-3 py-2 text-left transition hover:bg-[#1a2847]"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-[var(--tb-text-primary)]">
                              {player.name}
                            </p>
                            <p className="text-xs text-[var(--tb-text-secondary)]">
                              {player.displayRank}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-bold text-[var(--tb-accent)]">
                              レート: {player.rating}
                            </p>
                          </div>

                          <div className="hidden min-w-[80px] text-right sm:block">
                            <p className="text-xs text-[var(--tb-text-secondary)]">
                              {player.desiredRoles.slice(0, 2).join('/')}
                            </p>
                          </div>
                        </div>

                        <div className="text-[var(--tb-text-secondary)]">
                          {isExpandedList[index] ? '▼' : '▶'}
                        </div>
                      </button>
                    </div>

                    {isExpandedList[index] && (
                      <div className="border-b border-[var(--tb-border)] bg-[#0c1a35] px-3 py-3">
                        {isEditModeList[index] ? (
                          <PlayerEditCard
                            currentPlayer={player}
                            setEditablePlayer={(updatedPlayer) =>
                              handleUpdatePlayer(index, updatedPlayer)
                            }
                            onEditModeToggle={(e: React.MouseEvent) =>
                              handleToggleEditMode(e, index)
                            }
                          />
                        ) : isDeleteModeList[index] ? (
                          <PlayerDeleteCard
                            playerName={player.name}
                            onDelete={() => onRemovePlayerByIndex(index)}
                            onDeleteModeToggle={(e: React.MouseEvent) =>
                              handleToggleDeleteMode(e, index)
                            }
                          />
                        ) : (
                          <PlayerDetailCard
                            currentPlayer={player}
                            onEditModeToggle={(e: React.MouseEvent) =>
                              handleToggleEditMode(e, index)
                            }
                            onDeleteModeToggle={(e: React.MouseEvent) =>
                              handleToggleDeleteMode(e, index)
                            }
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-[var(--tb-text-secondary)]">
                一括編集では全プレイヤーをまとめて編集できます。編集後に「一括保存」で確定してください。
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
                    <span
                      className="text-sm text-emerald-300"
                      aria-live="polite"
                    >
                      {savedMessage}
                    </span>
                  )}
                  <button
                    onClick={handleSaveAll}
                    disabled={!isDirty}
                    className={`rounded px-5 py-2 font-semibold text-white transition ${
                      isDirty
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'cursor-not-allowed bg-gray-400 text-gray-700'
                    }`}
                  >
                    一括保存
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
