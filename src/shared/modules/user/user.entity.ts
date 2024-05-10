import { User, UserType } from '../../types/index.js';
import { getModelForClass, prop } from '@typegoose/typegoose';

export class UserEntity implements User {
  @prop({required: true, trim: true})
  public name: string;

  @prop({required: true, trim: true, unique: true})
  public email: string;

  @prop({required: true, trim: true})
  public avatarUrl: string;

  @prop({required: true, trim: true})
  public password: string;

  @prop({required: true, enum: UserType})
  public type: UserType;
}
export const UserModel = getModelForClass(UserEntity);
