import { Player, PlayerJson } from './player'
import { rankEnum, tierEnum } from './rank'
import { parseChatLogs } from './utils'

export interface PlayersJson {
  version: string
  players: PlayerJson[]
}

export class TeamBalancer {
  private static readonly TEAM_SIZE = 5
  private static readonly TOTAL_PLAYERS = 50
  private static readonly MAX_TEAM_ATTEMPTS = 100000
  private static readonly PLAYERS_VERSION = '1.0'

  players: Player[] = []
  balancedTeamsByMissMatch: Record<
    number,
    { players: Player[]; evaluationScore: number }
  > = {}

  constructor() {
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

  get playersInfo(): PlayersJson {
    return {
      version: TeamBalancer.PLAYERS_VERSION,
      players: this.players.map((p) => p.playerInfo) || [],
    }
  }

  setPlayersFromPlayersJson(playersJson: PlayersJson): Player[] {
    this.players = playersJson.players.map((player) => {
      const newPlayer = new Player(player.name)
      newPlayer.desiredRoles = player.desiredRoles
      newPlayer.isRoleFixed = player.isRoleFixed
      newPlayer.tier = player.tier as tierEnum
      newPlayer.rank = player.rank as rankEnum
      newPlayer.displayRank = player.displayRank
      newPlayer.rating = player.rating
      return newPlayer
    })
    return this.players
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
    const parsedLogs = parseChatLogs(logs)
    if (parsedLogs.length === 0) return

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

    this._resetBalancedTeamsByMissMatch()
    for (let i = 0; i < TeamBalancer.MAX_TEAM_ATTEMPTS; i++) {
      const { players, mismatchCount, evaluationScore } = this._createTeams()

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

  private _shufflePlayers(players: Player[]): void {
    for (let i = players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[players[i], players[j]] = [players[j], players[i]]
    }
  }

  private _createTeams(): {
    players: Player[]
    mismatchCount: number
    evaluationScore: number
  } {
    const participatePlayers = this.players.filter(
      (p) => p.isParticipatingInGame
    )
    this._shufflePlayers(participatePlayers)

    let mismatchCount = 0
    for (let i = 0; i < participatePlayers.length; i++) {
      const player = participatePlayers[i]
      if (player.desiredRoles[i % 5] === false) {
        if (player.isRoleFixed) {
          return { players: [], mismatchCount: -1, evaluationScore: Infinity }
        }
        mismatchCount++
      }
    }

    const totalRatingDifference =
      this._calculateTotalRatingDifference(participatePlayers)
    const laneRatingDifference =
      this._calculateLaneRatingDifference(participatePlayers)
    const adcSupPairDifference =
      this._calculateAdcSupPairDifference(participatePlayers)

    const weights = {
      totalRatingDifference: 0.3,
      laneRatingDifference: 0.5,
      adcSupPairDifference: 0.2,
    }
    const evaluationScore =
      weights.totalRatingDifference * totalRatingDifference +
      weights.laneRatingDifference * laneRatingDifference +
      weights.adcSupPairDifference * adcSupPairDifference

    return { players: participatePlayers, mismatchCount, evaluationScore }
  }

  private _calculateTotalRatingDifference(players: Player[]): number {
    const blueTeam = players.slice(0, TeamBalancer.TEAM_SIZE)
    const redTeam = players.slice(TeamBalancer.TEAM_SIZE)

    const blueTeamRating = blueTeam.reduce(
      (total, player) => total + player.rating,
      0
    )
    const redTeamRating = redTeam.reduce(
      (total, player) => total + player.rating,
      0
    )

    return Math.abs(blueTeamRating - redTeamRating)
  }

  private _calculateLaneRatingDifference(players: Player[]): number {
    const blueTeam = players.slice(0, TeamBalancer.TEAM_SIZE)
    const redTeam = players.slice(TeamBalancer.TEAM_SIZE)

    let laneRatingDifference = 0
    for (let i = 0; i < TeamBalancer.TEAM_SIZE; i++) {
      laneRatingDifference += Math.abs(blueTeam[i].rating - redTeam[i].rating)
    }

    return laneRatingDifference
  }

  private _calculateAdcSupPairDifference(players: Player[]): number {
    const blueAdc = players[3]
    const blueSup = players[4]
    const redAdc = players[8]
    const redSup = players[9]

    const bluePairRating = blueAdc.rating + blueSup.rating
    const redPairRating = redAdc.rating + redSup.rating

    return Math.abs(bluePairRating - redPairRating)
  }
}
