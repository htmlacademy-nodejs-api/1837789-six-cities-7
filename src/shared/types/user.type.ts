export enum UserType {
  basic = 'обычный',
  pro = 'pro'
}

export type User = {
  name: string;
  email: string;
  avatarUrl?: string;
  password: string;
  type: UserType
}
