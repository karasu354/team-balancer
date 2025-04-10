import { TeamDivider } from '../../utils/team-divider';
import { Player } from '../../utils/player';
import { tierEnum, rankEnum } from '../../utils/rank';

describe('TeamDivider', () => {
  let teamDivider: TeamDivider;

  beforeEach(() => {
    teamDivider = new TeamDivider();
  });

  describe('addPlayer', () => {
    it('プレイヤーを追加できることを確認する', () => {
      const player = new Player('Player1', 'Tag#1234');
      teamDivider.addPlayer(player);

      expect(teamDivider.getPlayers()).toHaveLength(1);
      expect(teamDivider.getPlayers()[0].getName()).toBe('Player1');
    });

    it('プレイヤーが最大数を超える場合、エラーがスローされることを確認する', () => {
      for (let i = 0; i < 10; i++) {
        teamDivider.addPlayer(new Player(`Player${i + 1}`, `Tag#${i + 1}`));
      }

      expect(() =>
        teamDivider.addPlayer(new Player('ExtraPlayer', 'Tag#9999'))
      ).toThrow('Cannot add more players. Maximum limit reached.');
    });
  });

  describe('removePlayer', () => {
    it('プレイヤーを削除できることを確認する', () => {
      const player1 = new Player('Player1', 'Tag#1234');
      const player2 = new Player('Player2', 'Tag#5678');
      teamDivider.addPlayer(player1);
      teamDivider.addPlayer(player2);

      teamDivider.removePlayer(0);

      expect(teamDivider.getPlayers()).toHaveLength(1);
      expect(teamDivider.getPlayers()[0].getName()).toBe('Player2');
    });

    it('無効なインデックスでプレイヤーを削除しようとするとエラーがスローされることを確認する', () => {
      expect(() => teamDivider.removePlayer(0)).toThrow('Invalid index');
    });
  });

  describe('isDividable', () => {
    it('プレイヤーが10人未満の場合、チーム分けができないことを確認する', () => {
      for (let i = 0; i < 9; i++) {
        teamDivider.addPlayer(new Player(`Player${i + 1}`, `Tag#${i + 1}`));
      }

      expect(teamDivider.isDividable()).toBe(false);
    });

    it('プレイヤーが10人の場合、チーム分けが可能であることを確認する', () => {
      for (let i = 0; i < 10; i++) {
        teamDivider.addPlayer(new Player(`Player${i + 1}`, `Tag#${i + 1}`));
      }

      expect(teamDivider.isDividable()).toBe(true);
    });
  });

  describe('divideTeams', () => {
    it('5000回の試行で希望に合わない人数ごとの最適なチーム分けが登録されることを確認する', () => {
      for (let i = 0; i < 10; i++) {
        const player = new Player(`Player${i + 1}`, `Tag#${i + 1}`);
        player.setRank(tierEnum.gold, rankEnum.one);
        teamDivider.addPlayer(player);
      }

      teamDivider.divideTeams();

      const teamDivisions = teamDivider.getTeamDivisions();
      expect(Object.keys(teamDivisions)).toHaveLength(11); // 0～10のキーが存在する
      for (let mismatchCount = 0; mismatchCount <= 10; mismatchCount++) {
        const division = teamDivisions[mismatchCount];
        expect(division).toHaveProperty('players');
        expect(division).toHaveProperty('ratingDifference');
        if (division.players.length > 0) {
          expect(division.players).toHaveLength(10);
        }
      }
    });
  });

  describe('getTeamDivisions', () => {
    it('希望に合わない人数ごとのチーム分けが取得できることを確認する', () => {
      for (let i = 0; i < 10; i++) {
        const player = new Player(`Player${i + 1}`, `Tag#${i + 1}`);
        player.setRank(tierEnum.gold, rankEnum.one);
        teamDivider.addPlayer(player);
      }

      teamDivider.divideTeams();

      const teamDivisions = teamDivider.getTeamDivisions();
      expect(teamDivisions).toBeDefined();
      expect(Object.keys(teamDivisions)).toHaveLength(11); // 0～10のキーが存在する
    });
  });
});