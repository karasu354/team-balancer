import React from 'react'

import { Player } from '../utils/player'
import { isNoRankTier, rankEnum, tierEnum } from '../utils/rank'
import { roleEnum } from '../utils/role'

interface BulkEditRowProps {
  player: Player
  onChange: (updated: Player) => void
  onRemove: () => void
}

const BulkEditRow: React.FC<BulkEditRowProps> = ({
  player,
  onChange,
  onRemove,
}) => {
  const update = <K extends keyof Player>(key: K, value: Player[K]) => {
    const updated = Player.fromJson(player.playerInfo)
    updated.isParticipatingInGame = player.isParticipatingInGame
    Object.assign(updated, { [key]: value })
    if (key === 'tier' || key === 'rank') {
      updated.setCalculatedRating()
      updated.setDisplayRank()
    }
    onChange(updated)
  }

  const selectClass =
    'rounded border border-slate-300 bg-white px-1 py-1 text-xs'

  return (
    <div className="flex flex-wrap items-center gap-2 rounded border border-slate-200 bg-white px-3 py-2">
      <label className="flex cursor-pointer items-center gap-1" title="参加">
        <input
          type="checkbox"
          checked={player.isParticipatingInGame}
          onChange={(e) => update('isParticipatingInGame', e.target.checked)}
          className="h-4 w-4"
        />
      </label>

      <input
        type="text"
        value={player.name}
        onChange={(e) => update('name', e.target.value)}
        className="min-w-24 flex-1 rounded border border-slate-300 px-2 py-1 text-sm"
        placeholder="プレイヤー名"
      />

      <select
        value={player.tier}
        onChange={(e) => update('tier', e.target.value as tierEnum)}
        className={selectClass}
      >
        {Object.values(tierEnum).map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {!isNoRankTier(player.tier) && (
        <select
          value={player.rank}
          onChange={(e) => update('rank', e.target.value as rankEnum)}
          className={selectClass}
        >
          {Object.values(rankEnum).map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      )}

      <select
        value={player.mainRole}
        onChange={(e) => update('mainRole', e.target.value as roleEnum)}
        className={selectClass}
      >
        {Object.values(roleEnum).map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      {player.mainRole !== roleEnum.all && (
        <select
          value={player.subRole}
          onChange={(e) => update('subRole', e.target.value as roleEnum)}
          className={selectClass}
        >
          {Object.values(roleEnum)
            .filter((r) => r !== roleEnum.all && r !== player.mainRole)
            .map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
        </select>
      )}

      <label className="flex items-center gap-1 text-xs text-slate-600">
        <input
          type="checkbox"
          checked={player.isRoleFixed}
          onChange={(e) => update('isRoleFixed', e.target.checked)}
          className="h-3 w-3"
        />
        固定
      </label>

      <div className="flex flex-wrap items-center gap-1">
        <span className="text-xs text-slate-500">希望:</span>
        {Object.values(roleEnum)
          .filter((r) => r !== roleEnum.all)
          .map((r) => (
            <label
              key={r}
              className="flex cursor-pointer items-center gap-0.5 text-xs text-slate-600"
            >
              <input
                type="checkbox"
                checked={player.desiredRoles.includes(r)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...player.desiredRoles, r]
                    : player.desiredRoles.filter((d) => d !== r)
                  update('desiredRoles', next)
                }}
                className="h-3 w-3"
              />
              {r}
            </label>
          ))}
      </div>

      <button
        onClick={onRemove}
        className="rounded bg-red-100 px-2 py-1 text-xs text-red-700 hover:bg-red-200"
      >
        削除
      </button>
    </div>
  )
}

export default BulkEditRow
