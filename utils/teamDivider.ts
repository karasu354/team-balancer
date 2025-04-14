import { Player, PlayerJson } from './player'
import { rankEnum, tierEnum } from './rank'
import { parseChatLogs } from './utils'

export interface PlayersJson {
  version: string
  players: PlayerJson[]
}

export class TeamDivider {
  private static readonly TEAM_SIZE = 5
  private static readonly TOTAL_PLAYERS = 50
  private static readonly MAX_TEAM_ATTEMPTS = 100000

  players: Player[] = []
  teamDivisions: Record<
    number,
    { players: Player[]; evaluationScore: number }
  > = {}

  constructor() {
    this._resetTeamDivisions()
  }

  get playersInfo(): PlayersJson {
    return {
      version: '1.0',
      players: this.players.map((p) => p.playerInfo) || [],
    }
  }

  setPlayersFromPlayersJson(playersJson: PlayersJson): Player[] {
    this.players = playersJson.players.map((player) => {
      const newPlayer = new Player(player.name, player.tagLine)
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
    if (this.players.length >= TeamDivider.TOTAL_PLAYERS) {
      throw new Error('Cannot add more players. Maximum limit reached.')
    }
    if (this.players.some((p) => p.name === player.name)) {
      return
    }
    this.players.push(player)
  }

  removePlayerByIndex(index: number): void {
    if (index < 0 || index >= this.players.length) {
      throw new Error('Invalid index')
    }
    this.players.splice(index, 1)
  }

  getPlayersByLog(logs: string): void {
    const parsedLogs = parseChatLogs(logs)
    if (parsedLogs.length === 0) return

    this.players = []
    for (const [name, tag] of parsedLogs) {
      const player = new Player(name, tag)
      this.addPlayer(player)
    }
  }

  private _resetTeamDivisions(): void {
    for (let i = 0; i <= TeamDivider.TEAM_SIZE * 2; i++) {
      this.teamDivisions[i] = { players: [], evaluationScore: Infinity }
    }
  }

  isDividable(): boolean {
    return (
      this.players.filter((p) => p.isParticipatingInGame).length ===
      TeamDivider.TEAM_SIZE * 2
    )
  }

  divideTeams(): void {
    if (!this.isDividable()) {
      throw new Error('Cannot divide teams with the current players')
    }

    this._resetTeamDivisions()
    for (let i = 0; i < TeamDivider.MAX_TEAM_ATTEMPTS; i++) {
      const { players, mismatchCount, evaluationScore } = this._createTeams()

      if (mismatchCount === -1) continue
      if (evaluationScore < this.teamDivisions[mismatchCount].evaluationScore) {
        this.teamDivisions[mismatchCount] = { players, evaluationScore }
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
    const blueTeam = players.slice(0, TeamDivider.TEAM_SIZE)
    const redTeam = players.slice(TeamDivider.TEAM_SIZE)

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
    const blueTeam = players.slice(0, TeamDivider.TEAM_SIZE)
    const redTeam = players.slice(TeamDivider.TEAM_SIZE)

    let laneRatingDifference = 0
    for (let i = 0; i < TeamDivider.TEAM_SIZE; i++) {
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
