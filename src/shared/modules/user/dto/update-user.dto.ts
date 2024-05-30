import { UserType } from '../../../types/user.type.js';

export class UpdateUserDto {
  public name?: string;
  public password?: string;
  public email?: string;
  public type?: UserType;
  public avatarUrl?: string;
}
