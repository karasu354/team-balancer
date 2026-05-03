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
    <div className="min-h-screen px-4 py-5 md:px-8 md:py-8">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <header className="rounded-2xl border border-[var(--tb-border)] bg-[var(--tb-surface)] p-4 shadow-lg shadow-black/20 md:p-6">
          <div className="mb-4 flex flex-col gap-3 border-b border-[var(--tb-border)] pb-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/logo.svg"
                alt="Team Balancer Logo"
                className="h-10 w-10"
              />
              <div>
                <p className="text-xs font-semibold tracking-widest text-[var(--tb-accent)] uppercase">
                  TEAM BALANCER
                </p>
                <h1 className="text-xl font-bold md:text-3xl">
                  LoL カスタムチーム編成
                </h1>
              </div>
            </div>
            <a
              href="#save-load"
              className="inline-flex items-center justify-center rounded-lg border border-[var(--tb-border)] bg-[var(--tb-surface-muted)] px-4 py-2 text-sm font-semibold text-[var(--tb-text-primary)] transition hover:border-[var(--tb-accent)] hover:text-[var(--tb-accent)]"
            >
              保存済みチームへ
            </a>
          </div>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <div className="rounded-xl border border-[var(--tb-border)] bg-[#0f1a34] px-3 py-2">
              <p className="text-xs text-[var(--tb-text-secondary)]">
                登録人数
              </p>
              <p className="text-2xl font-extrabold text-[var(--tb-text-primary)]">
                {totalPlayersCount}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--tb-border)] bg-[#0f1a34] px-3 py-2">
              <p className="text-xs text-[var(--tb-text-secondary)]">参加中</p>
              <p className="text-2xl font-extrabold text-[var(--tb-text-primary)]">
                {participatingPlayersCount}/10
              </p>
            </div>
          </div>
        </header>

        <section
          id="save-load"
          className="rounded-2xl border border-[var(--tb-border)] bg-[var(--tb-surface)] p-4 shadow-lg shadow-black/20 md:p-6"
        >
          <h2 className="text-base font-bold md:text-lg">保存 / 復元</h2>
          <p className="mb-3 text-xs text-[var(--tb-text-secondary)] md:text-sm">
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

        <section className="rounded-2xl border border-[var(--tb-border)] bg-[var(--tb-surface)] p-4 shadow-lg shadow-black/20 md:p-6">
          <h2 className="text-base font-bold md:text-lg">1. プレイヤー入力</h2>
          <p className="mb-3 text-xs text-[var(--tb-text-secondary)] md:text-sm">
            単独か一括で追加
          </p>
          <PlayerInputForm
            teamBalancer={teamBalancer}
            onAppUpdate={handleAppUpdate}
          />
          {totalPlayersCount === 0 && (
            <div className="mt-4 rounded-xl border border-[var(--tb-border)] bg-[#0f1a34] p-3">
              <p className="mb-2 text-xs text-[var(--tb-text-secondary)]">
                サンプルデータを投入
              </p>
              <button
                onClick={handleLoadSampleData}
                className="rounded-lg border border-[var(--tb-border)] bg-[var(--tb-surface-muted)] px-3 py-1 text-xs font-semibold text-[var(--tb-text-primary)] transition hover:border-[var(--tb-accent)] hover:text-[var(--tb-accent)] md:text-sm"
              >
                サンプル投入（10人）
              </button>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[var(--tb-border)] bg-[var(--tb-surface)] p-4 shadow-lg shadow-black/20 md:p-6">
          <h2 className="text-base font-bold md:text-lg">2. プレイヤー一覧</h2>
          <p className="mb-3 text-xs text-[var(--tb-text-secondary)] md:text-sm">
            参加状態を調整
          </p>
          <PlayersTable
            teamBalancer={teamBalancer}
            onRemovePlayerByIndex={handleRemovePlayer}
            onAppUpdate={handleAppUpdate}
          />
        </section>

        <section className="rounded-2xl border border-[var(--tb-border)] bg-[var(--tb-surface)] p-4 shadow-lg shadow-black/20 md:p-6">
          <h2 className="text-base font-bold md:text-lg">3. チーム分割</h2>
          <p className="mb-3 text-xs text-[var(--tb-text-secondary)] md:text-sm">
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
