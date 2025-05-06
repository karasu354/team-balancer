export enum roleEnum {
  top = 'TOP',
  jg = 'JG',
  mid = 'MID',
  bot = 'BOT',
  sup = 'SUP',
  all = 'ALL',
}

export const roleList = Object.values(roleEnum).filter(
  (role) => role !== roleEnum.all
)
