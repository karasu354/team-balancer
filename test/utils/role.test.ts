import { roleEnum, roleList } from '../../utils/role'

describe('roleList', () => {
  test('roleList に ALL が含まれないこと', () => {
    expect(roleList).not.toContain(roleEnum.all)
  })

  test('roleList の型が roleEnum[] であること', () => {
    roleList.forEach((role) => {
      expect(Object.values(roleEnum)).toContain(role)
    })
  })
})
