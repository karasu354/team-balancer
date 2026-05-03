import React, { useState } from 'react'

import { tierEnum } from '../utils/rank'
import { roleEnum } from '../utils/role'
import { TeamBalancer } from '../utils/teamBalancer'
import ChatLogInputForm from './Form/ChatLogInputForm'
import SinglePlayerInputForm from './Form/SinglePlayerInputForm'
import Tabs from './Navigation/Tabs'

interface PlayerInputFormProps {
  teamBalancer: TeamBalancer
  onAppUpdate: () => void
}

const PlayerInputForm: React.FC<PlayerInputFormProps> = ({
  teamBalancer,
  onAppUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0)
  const [isExpanded, setIsExpanded] = useState<boolean>(true)
  const [preview, setPreview] = useState<{
    tier: tierEnum
    displayRank: string
    rating: number
    desiredRoles: roleEnum[]
  }>({
    tier: tierEnum.iron,
    displayRank: 'IRON IV',
    rating: 400,
    desiredRoles: Object.values(roleEnum).filter(
      (role) => role !== roleEnum.all
    ),
  })

  const tierBadgeClassMap: Record<tierEnum, string> = {
    [tierEnum.iron]: 'bg-slate-500/20 text-slate-200 border-slate-400/40',
    [tierEnum.bronze]: 'bg-amber-700/20 text-amber-200 border-amber-500/40',
    [tierEnum.silver]: 'bg-gray-500/20 text-gray-100 border-gray-300/40',
    [tierEnum.gold]: 'bg-yellow-500/20 text-yellow-100 border-yellow-400/40',
    [tierEnum.platinum]: 'bg-cyan-500/20 text-cyan-100 border-cyan-400/40',
    [tierEnum.emerald]:
      'bg-emerald-500/20 text-emerald-100 border-emerald-400/40',
    [tierEnum.diamond]: 'bg-sky-500/20 text-sky-100 border-sky-400/40',
    [tierEnum.master]:
      'bg-fuchsia-500/20 text-fuchsia-100 border-fuchsia-400/40',
    [tierEnum.grandmaster]: 'bg-rose-500/20 text-rose-100 border-rose-400/40',
    [tierEnum.challenger]:
      'bg-indigo-500/20 text-indigo-100 border-indigo-400/40',
  }

  return (
    <div className="w-full rounded-xl border border-[var(--tb-border)] bg-[#0f1a34] p-3">
      <div className="mb-3 rounded-xl border border-[var(--tb-border)] bg-[var(--tb-surface)] p-3">
        <p className="text-xs text-[var(--tb-text-secondary)]">
          入力プレビュー
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2 py-1 text-xs font-semibold ${
              tierBadgeClassMap[preview.tier]
            }`}
          >
            {preview.displayRank}
          </span>
          <span className="rounded-full border border-[var(--tb-border)] bg-[#0b1730] px-2 py-1 text-xs text-[var(--tb-text-primary)]">
            レート予測: {preview.rating}
          </span>
          <span className="rounded-full border border-[var(--tb-border)] bg-[#0b1730] px-2 py-1 text-xs text-[var(--tb-text-secondary)]">
            希望ロール: {preview.desiredRoles.join(', ')}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="mb-3 flex w-full items-center justify-between rounded-lg border border-[var(--tb-border)] bg-[var(--tb-surface)] px-3 py-2 text-left text-sm font-semibold text-[var(--tb-text-primary)] hover:border-[var(--tb-accent)]"
        aria-expanded={isExpanded}
      >
        <span>プレイヤー追加フォーム</span>
        <span className="text-xs text-[var(--tb-text-secondary)]">
          {isExpanded ? '閉じる' : '開く'}
        </span>
      </button>

      {isExpanded ? (
        <>
          <div className="pb-4">
            <Tabs
              labels={['個別入力', '複数入力']}
              activeTab={activeTab}
              onActiveTab={setActiveTab}
            />
          </div>
          <div>
            {activeTab === 0 ? (
              <SinglePlayerInputForm
                teamBalancer={teamBalancer}
                onAppUpdate={onAppUpdate}
                onPreviewChange={setPreview}
              />
            ) : (
              <ChatLogInputForm
                teamBalancer={teamBalancer}
                onAppUpdate={onAppUpdate}
              />
            )}
          </div>
        </>
      ) : (
        <p className="text-xs text-[var(--tb-text-secondary)]">
          フォームは折りたたまれています。必要なときに「開く」を押してください。
        </p>
      )}
    </div>
  )
}

export default PlayerInputForm
