import { Player } from './player'
import { parseChatLogs } from './utils'

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

  /**
   * プレイヤーを追加する
   * @param player 追加するプレイヤー
   */
  addPlayer(player: Player): void {
    if (this.players.length >= TeamDivider.TOTAL_PLAYERS) {
      throw new Error('Cannot add more players. Maximum limit reached.')
    }
    if (this.players.some((p) => p.name === player.name)) {
      return
    }
    this.players.push(player)
  }

  /**
   * プレイヤーを削除する
   * @param index 削除するプレイヤーのインデックス
   */
  removePlayerByIndex(index: number): void {
    if (index < 0 || index >= this.players.length) {
      throw new Error('Invalid index')
    }
    this.players.splice(index, 1)
  }

  /**
   * チャットログを解析してプレイヤーリストを更新する
   * @param logs 改行コードを含むチャットログの文字列
   */
  getPlayersByLog(logs: string): void {
    const parsedLogs = parseChatLogs(logs)
    if (parsedLogs.length === 0) return

    this.players = []
    for (const [name, tag] of parsedLogs) {
      const player = new Player(name, tag)
      this.addPlayer(player)
    }
  }

  /**
   * teamDivisions を初期化する
   * @returns 初期化された teamDivisions
   */
  private _resetTeamDivisions(): void {
    for (let i = 0; i <= TeamDivider.TEAM_SIZE * 2; i++) {
      this.teamDivisions[i] = { players: [], evaluationScore: Infinity }
    }
  }

  /**
   * チーム分けが可能か確認する
   * @returns 分けられる場合は true、それ以外は false
   */
  isDividable(): boolean {
    return (
      this.players.filter((p) => p.isParticipatingInGame).length ===
      TeamDivider.TEAM_SIZE * 2
    )
  }

  /**
   * チームを分ける
   */
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

  /**
   * プレイヤーをシャッフルする
   * @param players シャッフル対象のプレイヤー配列
   */
  private _shufflePlayers(players: Player[]): void {
    for (let i = players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[players[i], players[j]] = [players[j], players[i]]
    }
  }

  /**
   * チームを作成し、評価値Dを計算する
   * @returns 作成されたプレイヤーの並び、希望に合わない人数、評価値D
   */
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

    const weights = {
      totalRatingDifference: 0.3,
      laneRatingDifference: 0.7,
    }
    const evaluationScore =
      weights.totalRatingDifference * totalRatingDifference +
      weights.laneRatingDifference * laneRatingDifference

    return { players: participatePlayers, mismatchCount, evaluationScore }
  }

  /**
   * チーム全体のレート合計の差を計算する
   * @param players プレイヤー配列
   * @returns チーム全体のレート差
   */
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

  /**
   * レーンごとのレート差を計算する
   * @param players プレイヤー配列
   * @returns レーンごとのレート差の合計
   */
  private _calculateLaneRatingDifference(players: Player[]): number {
    const blueTeam = players.slice(0, TeamDivider.TEAM_SIZE)
    const redTeam = players.slice(TeamDivider.TEAM_SIZE)

    let laneRatingDifference = 0
    for (let i = 0; i < TeamDivider.TEAM_SIZE; i++) {
      laneRatingDifference += Math.abs(blueTeam[i].rating - redTeam[i].rating)
    }

    return laneRatingDifference
  }
}
