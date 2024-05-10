import { User, UserType } from '../../types/index.js';

export class UserEntity implements User {
  public name: string;
  public email: string;
  public avatarUrl: string;
  public password: string;
  public type: UserType;
}
