import { Player, PlayerJson } from './player'
import { roleEnum } from './role'
import {
  generateInternalId,
  generateRandomPermutations,
  parseChatLogs,
} from './utils'

export interface PlayersJson {
  id: string
  version: string
  playersTotalCount: number
  players: PlayerJson[]
  matchHistories?: MatchHistory[]
}

type TeamSide = 'blue' | 'red'

type LaneRole =
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

export interface TeamsSnapshotPlayer {
  playerId: string
  playerName: string
  team: TeamSide
  role: LaneRole
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
}

export class TeamBalancer {
  private static readonly TEAM_SIZE = 5
  private static readonly TOTAL_PLAYERS = 50
  private static readonly MAX_TEAM_ATTEMPTS = 5000000
  private static readonly PLAYERS_VERSION = '0.0.1'
  private static readonly ELO_K_FACTOR = 30
  private static readonly ELO_SCALE = 400
  private static readonly ELO_PAIR_SCALE = 800
  private static readonly ELO_LANE_WEIGHT = 0.7
  private static readonly ELO_TEAM_WEIGHT = 0.3
  private static readonly ELO_PAIR_BLEND_WEIGHT = 0.2

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
    { players: Player[]; evaluationScore: number }
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
    teamBalancer.matchHistories =
      playersJson.matchHistories?.filter((history) =>
        TeamBalancer.isMatchHistory(history)
      ) || []
    return teamBalancer
  }

  private static isMatchHistory(value: unknown): value is MatchHistory {
    if (typeof value !== 'object' || value === null) {
      return false
    }

    const record = value as Record<string, unknown>
    return (
      typeof record.id === 'string' &&
      typeof record.playedAt === 'string' &&
      (record.winnerTeam === 'blue' || record.winnerTeam === 'red') &&
      typeof record.mismatchCount === 'number' &&
      Array.isArray(record.teamsSnapshot) &&
      Array.isArray(record.playerResults)
    )
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
    }

    const appliedHistory = this.applyMatchHistory(history)

    this.matchHistories = [appliedHistory, ...this.matchHistories]
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

    this.matchHistories = recalculatedHistories.sort(
      (left, right) =>
        new Date(right.playedAt).getTime() - new Date(left.playedAt).getTime()
    )

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
      const result = snapshotPlayer.team === history.winnerTeam ? 'win' : 'lose'
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
    this._resetBalancedTeamsByMissMatch()
    const shufflePatterns = generateRandomPermutations(
      Array.from({ length: TeamBalancer.TEAM_SIZE * 2 }, (_, i) => i),
      TeamBalancer.MAX_TEAM_ATTEMPTS
    )
    for (let i = 0; i < shufflePatterns.length; i++) {
      const pattern = shufflePatterns[i]
      const shuffledPlayers = pattern.map((index) => participatePlayers[index])
      const { players, mismatchCount, evaluationScore } =
        this._createTeams(shuffledPlayers)

      if (mismatchCount === -1) continue
      if (
        evaluationScore <
        this.balancedTeamsByMissMatch[mismatchCount].evaluationScore
      ) {
        this.balancedTeamsByMissMatch[mismatchCount] = {
          players,
          evaluationScore,
        }
      }
    }
  }

  private _createTeams(players: Player[]): {
    players: Player[]
    mismatchCount: number
    evaluationScore: number
  } {
    let mismatchCount = 0
    const roles = Object.values(roleEnum).filter(
      (role) => role !== roleEnum.all
    )

    for (let i = 0; i < players.length; i++) {
      const player = players[i]
      const role = roles[i % 5]

      if (!player.desiredRoles.includes(role)) {
        if (player.isRoleFixed) {
          return { players: [], mismatchCount: -1, evaluationScore: Infinity }
        }
        mismatchCount++
      }
    }

    const totalRatingDifference = this._calculateTotalRatingDifference(players)
    const laneRatingDifference = this._calculateLaneRatingDifference(players)
    const adcSupPairDifference = this._calculateAdcSupPairDifference(players)

    const weights = {
      totalRatingDifference: 0.3,
      laneRatingDifference: 0.5,
      adcSupPairDifference: 0.2,
    }
    const evaluationScore =
      weights.totalRatingDifference * totalRatingDifference +
      weights.laneRatingDifference * laneRatingDifference +
      weights.adcSupPairDifference * adcSupPairDifference

    return { players, mismatchCount, evaluationScore }
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
