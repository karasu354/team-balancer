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
    <div className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 md:px-8 md:py-10">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">
                Team Balancer
              </p>
              <h1 className="text-2xl font-bold md:text-3xl">
                LoL カスタムチーム編成
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                参加者を登録し、10人揃ったら公平な2チームへ自動分割します。
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
              <div className="rounded-lg bg-slate-100 px-3 py-2 text-right">
                <p className="text-xs text-slate-500">Total Players</p>
                <p className="text-lg font-bold">{totalPlayersCount}</p>
              </div>
              <div className="rounded-lg bg-slate-100 px-3 py-2 text-right">
                <p className="text-xs text-slate-500">Participating</p>
                <p className="text-lg font-bold">
                  {participatingPlayersCount}/10
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-lg font-bold">保存 / 復元</h2>
          <p className="mb-4 text-sm text-slate-600">
            ID
            を指定してチーム状態を保存・読み込みできます。アプリ開始時・終了前に使用してください。
          </p>
          <IdForm
            teamBalancer={teamBalancer}
            onUpdateTeamBalancer={handleUpdateTeamBalancer}
            onAppUpdate={handleAppUpdate}
          />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-lg font-bold">1. プレイヤー入力</h2>
          <p className="mb-4 text-sm text-slate-600">
            Single または Multi でプレイヤーを追加します。
          </p>
          <PlayerInputForm
            teamBalancer={teamBalancer}
            onAppUpdate={handleAppUpdate}
          />
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="mb-2 text-xs text-slate-500">
              アプリの操作に慣れるためのサンプルデータを投入できます。実際のゲームでは削除してください。
              {totalPlayersCount > 0 && (
                <span className="ml-1 font-semibold text-amber-600">
                  ※ 既にプレイヤーが登録されています。追加で投入されます。
                </span>
              )}
            </p>
            <button
              onClick={handleLoadSampleData}
              className="rounded border border-slate-300 bg-slate-50 px-3 py-1 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              サンプルデータを投入（10人）
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-lg font-bold">2. プレイヤー一覧</h2>
          <p className="mb-4 text-sm text-slate-600">
            参加切替・編集・削除を行い、分割前の状態を調整します。
          </p>
          <PlayersTable
            teamBalancer={teamBalancer}
            onRemovePlayerByIndex={handleRemovePlayer}
            onAppUpdate={handleAppUpdate}
          />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-lg font-bold">3. チーム分割</h2>
          <p className="mb-4 text-sm text-slate-600">
            参加者が10人のときに実行できます。結果はコピー可能です。
          </p>
          <DividedTeamTable
            teamBalancer={teamBalancer}
            onAppUpdate={handleAppUpdate}
          />
        </section>
      </main>
    </div>
  )
}

export default Home
