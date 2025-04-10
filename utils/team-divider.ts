import { Player } from './player';

export class TeamDivider {
  private static readonly TEAM_SIZE = 5;
  private static readonly TOTAL_PLAYERS = 10;

  private players: Player[] = [];
  private teamDivisions: Record<number, { players: Player[]; ratingDifference: number }> = {};

  constructor() {
    // teamDivisions を 0 から 10 のキーで初期化
    for (let i = 0; i <= TeamDivider.TOTAL_PLAYERS; i++) {
      this.teamDivisions[i] = { players: [], ratingDifference: Infinity };
    }
  }

  /**
   * プレイヤーを追加する
   * @param player 追加するプレイヤー
   */
  addPlayer(player: Player): void {
    if (this.players.length >= TeamDivider.TOTAL_PLAYERS) {
      throw new Error('Cannot add more players. Maximum limit reached.');
    }
    this.players.push(player);
  }

  /**
   * プレイヤーを削除する
   * @param index 削除するプレイヤーのインデックス
   */
  removePlayer(index: number): void {
    if (index < 0 || index >= this.players.length) {
      throw new Error('Invalid index');
    }
    this.players.splice(index, 1);
  }

  /**
   * 現在のプレイヤーリストを取得する
   * @returns プレイヤーの配列
   */
  getPlayers(): Player[] {
    return [...this.players];
  }

  /**
   * 希望に合わない人数ごとの最適なチーム分けを取得する
   * @returns 希望に合わない人数をキーにしたチーム分けの辞書
   */
  getTeamDivisions(): Record<number, { players: Player[]; ratingDifference: number }> {
    return this.teamDivisions;
  }

  /**
   * チーム分けが可能か確認する
   * @returns 分けられる場合は true、それ以外は false
   */
  isDividable(): boolean {
    return this.players.length === TeamDivider.TOTAL_PLAYERS;
  }

  /**
   * チームを分ける
   */
  divideTeams(): void {
    if (!this.isDividable()) {
      throw new Error('Cannot divide teams with the current players');
    }

    // 5000回チーム分けを試行
    for (let i = 0; i < 5000; i++) {
      const { players, mismatchCount, ratingDifference } = this._createTeams();

      // 希望に合わない人数をキーに辞書を更新
      if (
        ratingDifference < this.teamDivisions[mismatchCount].ratingDifference
      ) {
        this.teamDivisions[mismatchCount] = { players, ratingDifference };
      }
    }
  }

  /**
   * チームを作成し、希望に合わない人数を計算する
   * @returns 作成されたプレイヤーの並び、希望に合わない人数、レーティング差
   */
  private _createTeams(): { players: Player[]; mismatchCount: number; ratingDifference: number } {
    const shuffledPlayers = [...this.players];
    this._shufflePlayers(shuffledPlayers);

    let mismatchCount = 0;

    for (let i = 0; i < shuffledPlayers.length; i++) {
      if (shuffledPlayers[i].getDesiredRole()[i % 5] === 0) {
        mismatchCount++;
      }
    }

    const ratingDifference = this._calculateRatingDifference(shuffledPlayers);

    return { players: shuffledPlayers, mismatchCount, ratingDifference };
  }

  /**
   * プレイヤーをシャッフルする
   * @param players シャッフル対象のプレイヤー配列
   */
  private _shufflePlayers(players: Player[]): void {
    for (let i = players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [players[i], players[j]] = [players[j], players[i]];
    }
  }

  /**
   * プレイヤー配列からチームのレーティング差を計算する
   * @param players プレイヤー配列
   * @returns レーティング差
   */
  private _calculateRatingDifference(players: Player[]): number {
    const blueTeamRating = players
      .slice(0, TeamDivider.TEAM_SIZE)
      .reduce((total, player) => total + player.getRating(), 0);
    const redTeamRating = players
      .slice(TeamDivider.TEAM_SIZE)
      .reduce((total, player) => total + player.getRating(), 0);
    return Math.abs(blueTeamRating - redTeamRating);
  }
}
