import React, { useState } from 'react'

import DividedTeamTable from '../components/DividedTeamTable'
import IdForm from '../components/IdForm'
import PlayerInputForm from '../components/PlayerInputForm'
import PlayersTable from '../components/PlayersTable'
import { generateSamplePlayers } from '../utils/player'
import { TeamBalancer } from '../utils/teamBalancer'

const Home = () => {
  const [teamBalancer, setTeamBalancer] = useState<TeamBalancer>(
    new TeamBalancer()
  )
  const [currentTeamId, setCurrentTeamId] = useState<string>('')
  const [_, setUpdate] = useState<number>(0)
  const totalPlayersCount = teamBalancer.players.length
  const participatingPlayersCount = teamBalancer.players.filter(
    (player) => player.isParticipatingInGame
  ).length

  const handleAppUpdate = () => {
    setUpdate((prev) => prev + 1)
  }

  const handleRemovePlayer = (index: number) => {
    teamBalancer.removePlayerByIndex(index)
    handleAppUpdate()
  }

  const handleUpdateTeamBalancer = (newTeamBalancer: TeamBalancer) => {
    setTeamBalancer(newTeamBalancer)
    handleAppUpdate()
  }

  const handleLoadSampleData = () => {
    const samples = generateSamplePlayers()
    samples.forEach((p) => teamBalancer.addPlayer(p))
    handleAppUpdate()
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 px-4 py-4 text-slate-900 md:px-8 md:py-10">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-2 md:gap-4">
        <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-3">
            <div>
              <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase md:text-sm">
                Team Balancer
              </p>
              <h1 className="text-xl font-bold md:text-3xl">
                LoL カスタムチーム編成
              </h1>
              <p className="mt-1 text-xs text-slate-600 md:text-sm">
                10人揃ったら自動分割
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
              <div className="rounded-lg bg-slate-100 px-2 py-1 text-right md:px-3 md:py-2">
                <p className="text-xs text-slate-500">登録人数</p>
                <p className="text-lg font-bold">{totalPlayersCount}</p>
              </div>
              <div className="rounded-lg bg-slate-100 px-2 py-1 text-right md:px-3 md:py-2">
                <p className="text-xs text-slate-500">参加中</p>
                <p className="text-lg font-bold">
                  {participatingPlayersCount}/10
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <h2 className="text-base font-bold md:text-lg">保存 / 復元</h2>
          <p className="mb-3 text-xs text-slate-600 md:text-sm">
            状態を保存・復元
          </p>
          <IdForm
            activeTeamId={currentTeamId}
            teamBalancer={teamBalancer}
            onUpdateTeamBalancer={handleUpdateTeamBalancer}
            onActiveTeamIdChange={setCurrentTeamId}
            onAppUpdate={handleAppUpdate}
          />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <h2 className="text-base font-bold md:text-lg">1. プレイヤー入力</h2>
          <p className="mb-3 text-xs text-slate-600 md:text-sm">
            単独か一括で追加
          </p>
          <PlayerInputForm
            teamBalancer={teamBalancer}
            onAppUpdate={handleAppUpdate}
          />
          <div className="mt-3 border-t border-slate-100 pt-3 md:mt-4 md:pt-4">
            <p className="mb-2 text-xs text-slate-500">
              サンプルデータを投入
              {totalPlayersCount > 0 && (
                <span className="ml-1 font-semibold text-amber-600">
                  ※ 追加됨
                </span>
              )}
            </p>
            <button
              onClick={handleLoadSampleData}
              className="rounded border border-slate-300 bg-white px-3 py-1 text-xs text-slate-700 transition hover:bg-slate-50 md:text-sm"
            >
              サンプル投入（10人）
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <h2 className="text-base font-bold md:text-lg">2. プレイヤー一覧</h2>
          <p className="mb-3 text-xs text-slate-600 md:text-sm">
            参加状態を調整
          </p>
          <PlayersTable
            teamBalancer={teamBalancer}
            onRemovePlayerByIndex={handleRemovePlayer}
            onAppUpdate={handleAppUpdate}
          />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <h2 className="text-base font-bold md:text-lg">3. チーム分割</h2>
          <p className="mb-3 text-xs text-slate-600 md:text-sm">
            10人揃ったら実行
          </p>
          <DividedTeamTable
            currentTeamId={currentTeamId}
            teamBalancer={teamBalancer}
            onUpdateTeamBalancer={handleUpdateTeamBalancer}
            onAppUpdate={handleAppUpdate}
          />
        </section>
      </main>
    </div>
  )
}

export default Home
