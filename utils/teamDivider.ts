import { Player } from './player'
import { parseChatLogs } from './utils'

export class TeamDivider {
  private static readonly TEAM_SIZE = 5
  private static readonly TOTAL_PLAYERS = 10
  private static readonly MAX_TEAM_ATTEMPTS = 20000

  private players: (Player | null)[] = Array(TeamDivider.TOTAL_PLAYERS).fill(
    null
  )
  private teamDivisions: Record<
    number,
    { players: Player[]; evaluationScore: number }
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
    { players: Player[]; evaluationScore: number }
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
    for (let i = 0; i < TeamDivider.MAX_TEAM_ATTEMPTS; i++) {
      const { players, mismatchCount, evaluationScore } = this._createTeams()

      // 希望に合わない人数をキーに辞書を更新
      if (evaluationScore < this.teamDivisions[mismatchCount].evaluationScore) {
        this.teamDivisions[mismatchCount] = { players, evaluationScore }
      }
    }
  }

  /**
   * teamDivisions を初期化する
   * @returns 初期化された teamDivisions
   */
  private _resetTeamDivisions(): void {
    for (let i = 0; i <= TeamDivider.TOTAL_PLAYERS; i++) {
      this.teamDivisions[i] = { players: [], evaluationScore: Infinity }
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
    const shuffledPlayers = this.players.filter((p): p is Player => p !== null)
    this._shufflePlayers(shuffledPlayers)

    let mismatchCount = 0

    // 希望ロールに基づくペナルティを計算
    for (let i = 0; i < shuffledPlayers.length; i++) {
      if (shuffledPlayers[i].getDesiredRole()[i % 5] === 0) {
        mismatchCount++
      }
    }

    // 各要因Pを計算
    const totalRatingDifference =
      this._calculateTotalRatingDifference(shuffledPlayers)
    const laneRatingDifference =
      this._calculateLaneRatingDifference(shuffledPlayers)

    // 各要因Pに重みwを掛けて評価値Dを計算
    const weights = {
      totalRatingDifference: 0.7, // チーム全体のレート差の重み
      laneRatingDifference: 0.3, // レーンごとのレート差の重み
    }
    const evaluationScore =
      weights.totalRatingDifference * totalRatingDifference +
      weights.laneRatingDifference * laneRatingDifference

    return { players: shuffledPlayers, mismatchCount, evaluationScore }
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
      (total, player) => total + player.getRating(),
      0
    )
    const redTeamRating = redTeam.reduce(
      (total, player) => total + player.getRating(),
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
      laneRatingDifference += Math.abs(
        blueTeam[i].getRating() - redTeam[i].getRating()
      )
    }

    return laneRatingDifference
  }
}
