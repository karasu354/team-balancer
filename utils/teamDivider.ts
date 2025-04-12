import { Player } from './player'
import { parseChatLogs } from './utils'

export class TeamDivider {
  private static readonly TEAM_SIZE = 5
  private static readonly TOTAL_PLAYERS = 10

  private players: (Player | null)[] = Array(TeamDivider.TOTAL_PLAYERS).fill(
    null
  )
  private teamDivisions: Record<
    number,
    { players: Player[]; ratingDifference: number }
  > = {}

  constructor() {
    // teamDivisions を 0 から 10 のキーで初期化
    this._resetTeamDivisions()
  }

  /**
   * プレイヤーを追加する
   * @param player 追加するプレイヤー
   */
  addPlayer(player: Player): void {
    const emptyIndex = this.players.findIndex((p) => p === null)
    if (emptyIndex === -1) {
      throw new Error('Cannot add more players. Maximum limit reached.')
    }
    this.players[emptyIndex] = player
  }

  /**
   * プレイヤーを削除する
   * @param index 削除するプレイヤーのインデックス
   */
  removePlayer(index: number): void {
    if (
      index < 0 ||
      index >= this.players.length ||
      this.players[index] === null
    ) {
      throw new Error('Invalid index')
    }
    this.players[index] = null // 指定されたインデックスをnullにする
  }

  /**
   * 現在のプレイヤーリストを取得する
   * @returns プレイヤーの配列
   */
  getPlayers(): (Player | null)[] {
    return [...this.players]
  }

  /**
   * チャットログを解析してプレイヤーリストを更新する
   * @param logs 改行コードを含むチャットログの文字列
   */
  getPlayersByLog(logs: string): void {
    const parsedLogs = parseChatLogs(logs)

    // parsedLogs が空の場合は何もしない
    if (parsedLogs.length === 0) return

    // 既存のプレイヤーリストをクリア
    this.players = Array(TeamDivider.TOTAL_PLAYERS).fill(null)

    // パースしたログを基にプレイヤーを追加
    for (const [name, tag] of parsedLogs) {
      const player = new Player(name, tag)
      this.addPlayer(player)
    }
  }

  /**
   * 希望に合わない人数ごとの最適なチーム分けを取得する
   * @returns 希望に合わない人数をキーにしたチーム分けの辞書
   */
  getTeamDivisions(): Record<
    number,
    { players: Player[]; ratingDifference: number }
  > {
    return this.teamDivisions
  }

  /**
   * チーム分けが可能か確認する
   * @returns 分けられる場合は true、それ以外は false
   */
  isDividable(): boolean {
    return (
      this.players.filter((p) => p !== null).length ===
      TeamDivider.TOTAL_PLAYERS
    )
  }

  /**
   * チームを分ける
   */
  divideTeams(): void {
    if (!this.isDividable()) {
      throw new Error('Cannot divide teams with the current players')
    }

    // teamDivisions を初期化
    this._resetTeamDivisions()

    // 複数回チーム分けを試行
    for (let i = 0; i < 20000; i++) {
      const { players, mismatchCount, ratingDifference } = this._createTeams()

      // 希望に合わない人数をキーに辞書を更新
      if (
        ratingDifference < this.teamDivisions[mismatchCount].ratingDifference
      ) {
        this.teamDivisions[mismatchCount] = { players, ratingDifference }
      }
    }
  }

  /**
   * teamDivisions を初期化する
   * @returns 初期化された teamDivisions
   */
  private _resetTeamDivisions(): void {
    for (let i = 0; i <= TeamDivider.TOTAL_PLAYERS; i++) {
      this.teamDivisions[i] = { players: [], ratingDifference: Infinity }
    }
  }

  /**
   * チームを作成し、希望に合わない人数を計算する
   * @returns 作成されたプレイヤーの並び、希望に合わない人数、レーティング差
   */
  private _createTeams(): {
    players: Player[]
    mismatchCount: number
    ratingDifference: number
  } {
    const shuffledPlayers = this.players.filter((p): p is Player => p !== null)
    this._shufflePlayers(shuffledPlayers)

    let mismatchCount = 0

    for (let i = 0; i < shuffledPlayers.length; i++) {
      if (shuffledPlayers[i].getDesiredRole()[i % 5] === 0) {
        mismatchCount++
      }
    }

    const ratingDifference = this._calculateRatingDifference(shuffledPlayers)

    return { players: shuffledPlayers, mismatchCount, ratingDifference }
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
   * プレイヤー配列からチームのレーティング差を計算する
   * @param players プレイヤー配列
   * @returns レーティング差
   */
  private _calculateRatingDifference(players: Player[]): number {
    const blueTeam = players.slice(0, TeamDivider.TEAM_SIZE)
    const redTeam = players.slice(TeamDivider.TEAM_SIZE)

    // チーム全体のレート合計の差
    const blueTeamRating = blueTeam.reduce(
      (total, player) => total + player.getRating(),
      0
    )
    const redTeamRating = redTeam.reduce(
      (total, player) => total + player.getRating(),
      0
    )
    const totalRatingDifference = Math.abs(blueTeamRating - redTeamRating)

    // レーンごとのレート差
    let laneRatingDifference = 0
    for (let i = 0; i < TeamDivider.TEAM_SIZE; i++) {
      laneRatingDifference += Math.abs(
        blueTeam[i].getRating() - redTeam[i].getRating()
      )
    }

    // 総合評価として、チーム全体のレート差とレーンごとのレート差を加算
    return totalRatingDifference + laneRatingDifference
  }
}
