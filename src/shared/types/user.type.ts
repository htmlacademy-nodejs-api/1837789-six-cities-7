export enum UserType {
  usual = 'usual',
  pro = 'pro'
}

export type User = {
  name: string;
  email: string;
  avatarUrl: string;
  password: string;
  type: UserType
}
