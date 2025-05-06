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
}

export class TeamBalancer {
  private static readonly TEAM_SIZE = 5
  private static readonly TOTAL_PLAYERS = 50
  private static readonly MAX_TEAM_ATTEMPTS = 5000000
  private static readonly PLAYERS_VERSION = '0.0.1'

  id: string = ''
  playersTotalCount: number = 0
  players: Player[] = []
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
    return teamBalancer
  }

  get playersInfo(): PlayersJson {
    return {
      id: this.id,
      version: TeamBalancer.PLAYERS_VERSION,
      playersTotalCount: this.players.length,
      players: this.players.map((p) => p.playerInfo) || [],
    }
  }

  addPlayer(player: Player): void {
    if (this.players.length >= TeamBalancer.TOTAL_PLAYERS) {
      throw new Error(
        'これ以上プレイヤーを追加できません。最大人数に達しました。'
      )
    }
    if (this.players.some((p) => p.name === player.name)) {
      return
    }
    this.players.push(player)
  }

  removePlayerByIndex(index: number): void {
    if (index < 0 || index >= this.players.length) {
      throw new Error('無効なインデックスです。')
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
