import { Player, PlayerJson } from './player'
import { roleEnum } from './role'
import { generateInternalId, parseChatLogs } from './utils'

export interface PlayersJson {
  id: string
  version: string
  playersTotalCount: number
  players: PlayerJson[]
  matchHistories?: MatchHistory[]
}

type TeamSide = 'blue' | 'red'

export type LaneRole =
  | roleEnum.top
  | roleEnum.jg
  | roleEnum.mid
  | roleEnum.bot
  | roleEnum.sup

const TEAM_ROLES: LaneRole[] = [
  roleEnum.top,
  roleEnum.jg,
  roleEnum.mid,
  roleEnum.bot,
  roleEnum.sup,
]

const MATCH_SLOT_ROLES: LaneRole[] = [...TEAM_ROLES, ...TEAM_ROLES]

export type ManualTeamSlot = `${TeamSide}-${LaneRole}`

export type ManualAssignmentMap = Record<ManualTeamSlot, string | null>

export interface ManualAssignmentValidationResult {
  isValid: boolean
  errors: string[]
  missingSlots: ManualTeamSlot[]
  duplicatedPlayerIds: string[]
}

export const MANUAL_SLOT_ORDER: ManualTeamSlot[] = [
  'blue-TOP',
  'blue-JG',
  'blue-MID',
  'blue-BOT',
  'blue-SUP',
  'red-TOP',
  'red-JG',
  'red-MID',
  'red-BOT',
  'red-SUP',
]

export const buildEmptyManualAssignment = (): ManualAssignmentMap => {
  return {
    'blue-TOP': null,
    'blue-JG': null,
    'blue-MID': null,
    'blue-BOT': null,
    'blue-SUP': null,
    'red-TOP': null,
    'red-JG': null,
    'red-MID': null,
    'red-BOT': null,
    'red-SUP': null,
  }
}

export const createManualAssignmentFromArrangedPlayers = (
  players: Player[]
): ManualAssignmentMap => {
  const assignment = buildEmptyManualAssignment()

  for (let i = 0; i < Math.min(players.length, MANUAL_SLOT_ORDER.length); i++) {
    assignment[MANUAL_SLOT_ORDER[i]] = players[i].id
  }

  return assignment
}

export const validateManualAssignment = (
  participatingPlayers: Player[],
  assignment: ManualAssignmentMap
): ManualAssignmentValidationResult => {
  const errors: string[] = []

  if (participatingPlayers.length !== TEAM_ROLES.length * 2) {
    errors.push(
      '手動割り当ては参加プレイヤーが10人ちょうどの場合のみ確定できます。'
    )
  }

  const missingSlots = MANUAL_SLOT_ORDER.filter((slot) => !assignment[slot])
  if (missingSlots.length > 0) {
    errors.push('未配置のロールがあります。全ロールを埋めてください。')
  }

  const assignedPlayerIds = MANUAL_SLOT_ORDER.map(
    (slot) => assignment[slot]
  ).filter((playerId): playerId is string => playerId !== null)
  const duplicateSet = new Set<string>()
  const seenSet = new Set<string>()
  assignedPlayerIds.forEach((playerId) => {
    if (seenSet.has(playerId)) {
      duplicateSet.add(playerId)
      return
    }
    seenSet.add(playerId)
  })

  const duplicatedPlayerIds = Array.from(duplicateSet)
  if (duplicatedPlayerIds.length > 0) {
    errors.push('同一プレイヤーが複数ロールに配置されています。')
  }

  const participatingIds = new Set(
    participatingPlayers.map((player) => player.id)
  )
  const invalidAssignedIds = assignedPlayerIds.filter(
    (playerId) => !participatingIds.has(playerId)
  )
  if (invalidAssignedIds.length > 0) {
    errors.push('参加していないプレイヤーが割り当てられています。')
  }

  const unassignedParticipating = participatingPlayers.filter(
    (player) => !seenSet.has(player.id)
  )
  if (unassignedParticipating.length > 0) {
    errors.push('未配置プレイヤーが残っています。')
  }

  return {
    isValid: errors.length === 0,
    errors,
    missingSlots,
    duplicatedPlayerIds,
  }
}

export interface TeamsSnapshotPlayer {
  playerId: string
  playerName: string
  team: TeamSide
  role: LaneRole
}

export interface MismatchDetail {
  playerId: string
  playerName: string
  assignedRole: LaneRole
  desiredRoles: LaneRole[]
  isRoleFixed: boolean
}

export interface PlayerResult {
  playerId: string
  playerName: string
  team: TeamSide
  result: 'win' | 'lose'
  ratingDelta: number
  ratingBefore: number
  ratingAfter: number
}

export interface MatchHistory {
  id: string
  playedAt: string
  winnerTeam: TeamSide
  mismatchCount: number
  teamsSnapshot: TeamsSnapshotPlayer[]
  playerResults: PlayerResult[]
  mismatchDetails?: MismatchDetail[]
}

export const MAX_MATCH_HISTORIES = 50

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const isLaneRole = (value: unknown): value is LaneRole => {
  return (
    value === roleEnum.top ||
    value === roleEnum.jg ||
    value === roleEnum.mid ||
    value === roleEnum.bot ||
    value === roleEnum.sup
  )
}

const isMismatchDetails = (value: unknown): value is MismatchDetail[] => {
  if (value === undefined) {
    return true
  }

  if (!Array.isArray(value)) {
    return false
  }

  return value.every((detail) => {
    if (!isRecord(detail)) {
      return false
    }

    return (
      typeof detail.playerId === 'string' &&
      typeof detail.playerName === 'string' &&
      isLaneRole(detail.assignedRole) &&
      Array.isArray(detail.desiredRoles) &&
      detail.desiredRoles.every((role) => isLaneRole(role)) &&
      typeof detail.isRoleFixed === 'boolean'
    )
  })
}

const isMatchHistory = (value: unknown): value is MatchHistory => {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.playedAt === 'string' &&
    (value.winnerTeam === 'blue' || value.winnerTeam === 'red') &&
    typeof value.mismatchCount === 'number' &&
    Array.isArray(value.teamsSnapshot) &&
    Array.isArray(value.playerResults) &&
    isMismatchDetails(value.mismatchDetails)
  )
}

export const normalizeMatchHistories = (
  matchHistories: MatchHistory[] | undefined
): MatchHistory[] => {
  return (
    matchHistories
      ?.filter((history) => isMatchHistory(history))
      .map((history) => ({
        ...history,
        mismatchDetails: history.mismatchDetails ?? [],
      }))
      .sort(
        (left, right) =>
          new Date(right.playedAt).getTime() - new Date(left.playedAt).getTime()
      )
      .slice(0, MAX_MATCH_HISTORIES) || []
  )
}

export class TeamBalancer {
  private static readonly TEAM_SIZE = 5
  private static readonly TOTAL_PLAYERS = 50
  private static readonly MAX_MATCH_HISTORIES = MAX_MATCH_HISTORIES
  private static readonly MAX_TEAM_EVALUATIONS = 200000
  private static readonly TEAM_DIVIDE_TIME_LIMIT_MS = 1500
  private static readonly PLAYERS_VERSION = '0.0.1'
  private static readonly ELO_K_FACTOR = 30
  private static readonly ELO_SCALE = 400
  private static readonly ELO_PAIR_SCALE = 800
  private static readonly ELO_LANE_WEIGHT = 0.7
  private static readonly ELO_TEAM_WEIGHT = 0.3
  private static readonly ELO_PAIR_BLEND_WEIGHT = 0.2
  private static readonly TEAM_EVAL_TOTAL_RATING_WEIGHT = 0.2
  private static readonly TEAM_EVAL_LANE_RATING_WEIGHT = 0.6
  private static readonly TEAM_EVAL_ADC_SUP_PAIR_WEIGHT = 0.2

  // エラーメッセージの定数化
  private static readonly ERROR_MESSAGES = {
    MAX_PLAYERS: 'これ以上プレイヤーを追加できません。最大人数に達しました。',
    INVALID_INDEX: '無効なインデックスです。',
  }

  id: string = ''
  playersTotalCount: number = 0
  players: Player[] = []
  matchHistories: MatchHistory[] = []
  balancedTeamsByMissMatch: Record<
    number,
    {
      players: Player[]
      evaluationScore: number
      mismatchDetails: MismatchDetail[]
    }
  > = {}

  constructor() {
    this.id = generateInternalId()
    this._resetBalancedTeamsByMissMatch()
  }

  private _resetBalancedTeamsByMissMatch(): void {
    for (let i = 0; i <= TeamBalancer.TEAM_SIZE * 2; i++) {
      this.balancedTeamsByMissMatch[i] = {
        players: [],
        evaluationScore: Infinity,
        mismatchDetails: [],
      }
    }
  }

  static fromJson(playersJson: PlayersJson): TeamBalancer {
    const teamBalancer = new TeamBalancer()
    teamBalancer.id = playersJson.id
    teamBalancer.playersTotalCount = playersJson.playersTotalCount
    teamBalancer.players = playersJson.players.map((player) =>
      Player.fromJson(player)
    )
    teamBalancer.matchHistories = normalizeMatchHistories(
      playersJson.matchHistories
    )
    return teamBalancer
  }

  get playersInfo(): PlayersJson {
    return {
      id: this.id,
      version: TeamBalancer.PLAYERS_VERSION,
      playersTotalCount: this.players.length,
      players: this.players.map((p) => p.playerInfo) || [],
      matchHistories: this.matchHistories,
    }
  }

  finalizeMatchResult(
    arrangedPlayers: Player[],
    winnerTeam: TeamSide,
    mismatchCount: number
  ): MatchHistory {
    if (arrangedPlayers.length !== TeamBalancer.TEAM_SIZE * 2) {
      throw new Error('試合結果の確定には10人の分割結果が必要です。')
    }

    const teamsSnapshot: TeamsSnapshotPlayer[] = []

    arrangedPlayers.forEach((arrangedPlayer, index) => {
      const role = TEAM_ROLES[index % TeamBalancer.TEAM_SIZE]
      const team: TeamSide = index < TeamBalancer.TEAM_SIZE ? 'blue' : 'red'

      const targetPlayer = this.players.find((p) => p.id === arrangedPlayer.id)
      if (!targetPlayer) {
        throw new Error(
          '試合結果の確定に失敗しました。対象プレイヤーが見つかりません。'
        )
      }

      teamsSnapshot.push({
        playerId: targetPlayer.id,
        playerName: targetPlayer.name,
        team,
        role,
      })
    })

    const history: MatchHistory = {
      id: generateInternalId(),
      playedAt: new Date().toISOString(),
      winnerTeam,
      mismatchCount,
      teamsSnapshot,
      playerResults: [],
      mismatchDetails: this._buildMismatchDetails(arrangedPlayers),
    }

    const appliedHistory = this.applyMatchHistory(history)

    this.matchHistories = normalizeMatchHistories([
      appliedHistory,
      ...this.matchHistories,
    ]).slice(0, TeamBalancer.MAX_MATCH_HISTORIES)
    return appliedHistory
  }

  deleteMatchHistory(historyId: string): MatchHistory[] {
    const targetHistory = this.matchHistories.find(
      (history) => history.id === historyId
    )
    if (!targetHistory) {
      throw new Error('削除対象の履歴が見つかりません。')
    }

    const baselineRatings = this.createBaselineRatings()
    const historiesToReplay = this.matchHistories
      .filter((history) => history.id !== historyId)
      .sort(
        (left, right) =>
          new Date(left.playedAt).getTime() - new Date(right.playedAt).getTime()
      )

    this.players.forEach((player) => {
      player.rating = baselineRatings.get(player.id) ?? player.rating
    })

    const recalculatedHistories = historiesToReplay.map((history) =>
      this.applyMatchHistory(history)
    )

    this.matchHistories = normalizeMatchHistories(recalculatedHistories)

    return this.matchHistories
  }

  private applyMatchHistory(history: MatchHistory): MatchHistory {
    const playersById = new Map(
      this.players.map((player) => [player.id, player])
    )
    const ratingsBeforeById = new Map<string, number>()

    history.teamsSnapshot.forEach((snapshotPlayer) => {
      const targetPlayer = playersById.get(snapshotPlayer.playerId)
      if (!targetPlayer) {
        throw new Error(
          '履歴の再計算に失敗しました。対象プレイヤーが見つかりません。'
        )
      }

      ratingsBeforeById.set(snapshotPlayer.playerId, targetPlayer.rating)
    })

    const teamAverageRating = {
      blue: this.calculateTeamAverageRating(
        'blue',
        history.teamsSnapshot,
        ratingsBeforeById
      ),
      red: this.calculateTeamAverageRating(
        'red',
        history.teamsSnapshot,
        ratingsBeforeById
      ),
    }

    const botSupPairRating = {
      blue: this.calculateBotSupPairRating(
        'blue',
        history.teamsSnapshot,
        ratingsBeforeById
      ),
      red: this.calculateBotSupPairRating(
        'red',
        history.teamsSnapshot,
        ratingsBeforeById
      ),
    }

    const playerResults = history.teamsSnapshot.map((snapshotPlayer) => {
      const targetPlayer = playersById.get(snapshotPlayer.playerId)

      if (!targetPlayer) {
        throw new Error(
          '履歴の再計算に失敗しました。対象プレイヤーが見つかりません。'
        )
      }

      const opponentTeam: TeamSide =
        snapshotPlayer.team === 'blue' ? 'red' : 'blue'
      const result: PlayerResult['result'] =
        snapshotPlayer.team === history.winnerTeam ? 'win' : 'lose'
      const ratingBefore = ratingsBeforeById.get(snapshotPlayer.playerId) ?? 0

      const laneOpponent = history.teamsSnapshot.find(
        (player) =>
          player.team === opponentTeam && player.role === snapshotPlayer.role
      )

      const laneExpected = laneOpponent
        ? TeamBalancer.calculateExpectedScore(
            ratingBefore,
            ratingsBeforeById.get(laneOpponent.playerId) ?? ratingBefore,
            TeamBalancer.ELO_SCALE
          )
        : 0.5

      const teamExpected = TeamBalancer.calculateExpectedScore(
        teamAverageRating[snapshotPlayer.team],
        teamAverageRating[opponentTeam],
        TeamBalancer.ELO_SCALE
      )

      let expectedScore =
        TeamBalancer.ELO_LANE_WEIGHT * laneExpected +
        TeamBalancer.ELO_TEAM_WEIGHT * teamExpected

      if (
        snapshotPlayer.role === roleEnum.bot ||
        snapshotPlayer.role === roleEnum.sup
      ) {
        const ownPairRating = botSupPairRating[snapshotPlayer.team]
        const opponentPairRating = botSupPairRating[opponentTeam]

        if (ownPairRating !== null && opponentPairRating !== null) {
          const pairExpected = TeamBalancer.calculateExpectedScore(
            ownPairRating,
            opponentPairRating,
            TeamBalancer.ELO_PAIR_SCALE
          )
          expectedScore =
            expectedScore * (1 - TeamBalancer.ELO_PAIR_BLEND_WEIGHT) +
            pairExpected * TeamBalancer.ELO_PAIR_BLEND_WEIGHT
        }
      }

      const actualScore = result === 'win' ? 1 : 0
      const ratingDelta = Math.round(
        TeamBalancer.ELO_K_FACTOR * (actualScore - expectedScore)
      )
      const ratingAfter = ratingBefore + ratingDelta

      return {
        playerId: targetPlayer.id,
        playerName: targetPlayer.name,
        team: snapshotPlayer.team,
        result,
        ratingDelta,
        ratingBefore,
        ratingAfter,
      }
    })

    playerResults.forEach((result) => {
      const targetPlayer = playersById.get(result.playerId)
      if (targetPlayer) {
        targetPlayer.rating = result.ratingAfter
      }
    })

    return {
      ...history,
      playerResults,
    }
  }

  private static calculateExpectedScore(
    rating: number,
    opponentRating: number,
    scale: number
  ): number {
    return 1 / (1 + 10 ** ((opponentRating - rating) / scale))
  }

  private calculateTeamAverageRating(
    team: TeamSide,
    teamsSnapshot: TeamsSnapshotPlayer[],
    ratingsBeforeById: Map<string, number>
  ): number {
    const teamPlayers = teamsSnapshot.filter((player) => player.team === team)

    if (teamPlayers.length === 0) {
      return 0
    }

    const totalRating = teamPlayers.reduce(
      (sum, player) => sum + (ratingsBeforeById.get(player.playerId) ?? 0),
      0
    )

    return totalRating / teamPlayers.length
  }

  private calculateBotSupPairRating(
    team: TeamSide,
    teamsSnapshot: TeamsSnapshotPlayer[],
    ratingsBeforeById: Map<string, number>
  ): number | null {
    const botPlayer = teamsSnapshot.find(
      (player) => player.team === team && player.role === roleEnum.bot
    )
    const supPlayer = teamsSnapshot.find(
      (player) => player.team === team && player.role === roleEnum.sup
    )

    if (!botPlayer || !supPlayer) {
      return null
    }

    return (
      (ratingsBeforeById.get(botPlayer.playerId) ?? 0) +
      (ratingsBeforeById.get(supPlayer.playerId) ?? 0)
    )
  }

  private createBaselineRatings(): Map<string, number> {
    const deltaMap = new Map<string, number>()

    this.matchHistories.forEach((history) => {
      history.playerResults.forEach((result) => {
        const currentDelta = deltaMap.get(result.playerId) ?? 0
        deltaMap.set(result.playerId, currentDelta + (result.ratingDelta ?? 0))
      })
    })

    return new Map(
      this.players.map((player) => [
        player.id,
        player.rating - (deltaMap.get(player.id) ?? 0),
      ])
    )
  }

  addPlayer(player: Player): void {
    if (this.players.length >= TeamBalancer.TOTAL_PLAYERS) {
      throw new Error(TeamBalancer.ERROR_MESSAGES.MAX_PLAYERS)
    }
    if (this.players.some((p) => p.name === player.name)) {
      return
    }
    this.players.push(player)
  }

  removePlayerByIndex(index: number): void {
    if (index < 0 || index >= this.players.length) {
      throw new Error(TeamBalancer.ERROR_MESSAGES.INVALID_INDEX)
    }
    this.players.splice(index, 1)
  }

  addPlayersByLog(logs: string): void {
    if (!logs.trim()) return

    const parsedLogs = parseChatLogs(logs)
    parsedLogs.forEach((name) => {
      if (!this.players.some((player) => player.name === name)) {
        const newPlayer = new Player(name)
        this.addPlayer(newPlayer)
      }
    })
  }

  isDividable(): boolean {
    return (
      this.players.filter((p) => p.isParticipatingInGame).length ===
      TeamBalancer.TEAM_SIZE * 2
    )
  }

  divideTeams(): void {
    if (!this.isDividable()) {
      throw new Error('現在のプレイヤーではチーム分割ができません。')
    }

    const participatePlayers = this.players.filter(
      (p) => p.isParticipatingInGame
    )

    const sortedPlayers = [...participatePlayers].sort((left, right) =>
      left.id.localeCompare(right.id)
    )
    const smallestPlayerId = sortedPlayers[0]?.id ?? ''

    this._resetBalancedTeamsByMissMatch()

    const used = Array.from({ length: TeamBalancer.TEAM_SIZE * 2 }, () => false)
    const arrangedPlayers: Player[] = Array.from(
      { length: TeamBalancer.TEAM_SIZE * 2 },
      () => sortedPlayers[0]
    )
    const deadline = Date.now() + TeamBalancer.TEAM_DIVIDE_TIME_LIMIT_MS

    let evaluatedCount = 0
    let shouldStop = false

    const explore = (
      slotIndex: number,
      mismatchCount: number,
      isSmallestInBlueTeam: boolean
    ): void => {
      if (shouldStop) {
        return
      }

      if (Date.now() >= deadline) {
        shouldStop = true
        return
      }

      if (slotIndex === TeamBalancer.TEAM_SIZE && !isSmallestInBlueTeam) {
        return
      }

      if (slotIndex === TeamBalancer.TEAM_SIZE * 2) {
        if (evaluatedCount >= TeamBalancer.MAX_TEAM_EVALUATIONS) {
          shouldStop = true
          return
        }

        evaluatedCount++

        const {
          players,
          mismatchCount: resolvedMismatchCount,
          evaluationScore,
          mismatchDetails,
        } = this._createTeams([...arrangedPlayers], mismatchCount)

        if (
          evaluationScore <
          this.balancedTeamsByMissMatch[resolvedMismatchCount].evaluationScore
        ) {
          this.balancedTeamsByMissMatch[resolvedMismatchCount] = {
            players,
            evaluationScore,
            mismatchDetails,
          }
        }
        return
      }

      const role = MATCH_SLOT_ROLES[slotIndex]

      for (let i = 0; i < sortedPlayers.length; i++) {
        if (used[i]) {
          continue
        }

        const player = sortedPlayers[i]
        const isDesiredRole = player.desiredRoles.includes(role)
        if (!isDesiredRole && player.isRoleFixed) {
          continue
        }

        used[i] = true
        arrangedPlayers[slotIndex] = player
        explore(
          slotIndex + 1,
          mismatchCount + (isDesiredRole ? 0 : 1),
          isSmallestInBlueTeam ||
            (slotIndex < TeamBalancer.TEAM_SIZE &&
              player.id === smallestPlayerId)
        )
        used[i] = false

        if (shouldStop) {
          return
        }
      }
    }

    explore(0, 0, false)

    const hasBalancedTeam = Object.values(this.balancedTeamsByMissMatch).some(
      (team) => team.players.length === TeamBalancer.TEAM_SIZE * 2
    )

    if (!hasBalancedTeam) {
      throw new Error('条件を満たすチーム分割候補が見つかりません。')
    }
  }

  private _createTeams(
    players: Player[],
    preCalculatedMismatchCount?: number
  ): {
    players: Player[]
    mismatchCount: number
    evaluationScore: number
    mismatchDetails: MismatchDetail[]
  } {
    const mismatchDetails = this._buildMismatchDetails(players)
    const mismatchCount = preCalculatedMismatchCount ?? mismatchDetails.length

    const totalRatingDifference = this._calculateTotalRatingDifference(players)
    const laneRatingDifference = this._calculateLaneRatingDifference(players)
    const adcSupPairDifference = this._calculateAdcSupPairDifference(players)

    const evaluationScore =
      TeamBalancer.TEAM_EVAL_TOTAL_RATING_WEIGHT * totalRatingDifference +
      TeamBalancer.TEAM_EVAL_LANE_RATING_WEIGHT * laneRatingDifference +
      TeamBalancer.TEAM_EVAL_ADC_SUP_PAIR_WEIGHT * adcSupPairDifference

    return { players, mismatchCount, evaluationScore, mismatchDetails }
  }

  private _buildMismatchDetails(players: Player[]): MismatchDetail[] {
    const mismatchDetails: MismatchDetail[] = []

    for (let i = 0; i < players.length; i++) {
      const player = players[i]
      const assignedRole = MATCH_SLOT_ROLES[i]

      if (player.desiredRoles.includes(assignedRole)) {
        continue
      }

      mismatchDetails.push({
        playerId: player.id,
        playerName: player.name,
        assignedRole,
        desiredRoles: player.desiredRoles.filter(
          (role): role is LaneRole => role !== roleEnum.all
        ),
        isRoleFixed: player.isRoleFixed,
      })
    }

    return mismatchDetails
  }

  private _calculateTotalRatingDifference(players: Player[]): number {
    const roles = Object.values(roleEnum).filter(
      (role) => role !== roleEnum.all
    )
    let blueTeamRating = 0
    let redTeamRating = 0

    for (let i = 0; i < TeamBalancer.TEAM_SIZE; i++) {
      const player = players[i]
      const role = roles[i % 5]
      blueTeamRating += player.getRatingByRole(role)
    }
    for (let i = TeamBalancer.TEAM_SIZE; i < players.length; i++) {
      const player = players[i]
      const role = roles[i % 5]
      redTeamRating += player.getRatingByRole(role)
    }

    return Math.abs(blueTeamRating - redTeamRating)
  }

  private _calculateLaneRatingDifference(players: Player[]): number {
    const roles = Object.values(roleEnum).filter(
      (role) => role !== roleEnum.all
    )
    const blueTeam = players.slice(0, TeamBalancer.TEAM_SIZE)
    const redTeam = players.slice(TeamBalancer.TEAM_SIZE)

    let laneRatingDifference = 0
    for (let i = 0; i < TeamBalancer.TEAM_SIZE; i++) {
      const bluePlayer = blueTeam[i]
      const redPlayer = redTeam[i]
      const role = roles[i % 5]

      const bluePlayerRating = bluePlayer.getRatingByRole(role)
      const redPlayerRating = redPlayer.getRatingByRole(role)

      laneRatingDifference += Math.abs(bluePlayerRating - redPlayerRating)
    }

    return laneRatingDifference
  }

  private _calculateAdcSupPairDifference(players: Player[]): number {
    const blueAdc = players[3]
    const blueSup = players[4]
    const redAdc = players[8]
    const redSup = players[9]

    const bluePairRating =
      blueAdc.getRatingByRole(roleEnum.bot) +
      blueSup.getRatingByRole(roleEnum.sup)
    const redPairRating =
      redAdc.getRatingByRole(roleEnum.bot) +
      redSup.getRatingByRole(roleEnum.sup)

    return Math.abs(bluePairRating - redPairRating)
  }
}
