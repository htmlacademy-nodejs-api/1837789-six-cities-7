import { UserType } from '../../../types/user.type.js';
import {IsEmail, IsIn, IsOptional, IsString, Length} from 'class-validator';
import {CreateUserMessages} from './create-user.messages.js';

export class CreateUserDto {
  @IsString({ message: CreateUserMessages.name.invalidFormat })
  @Length(1, 15, { message: CreateUserMessages.name.lengthField })
  public name: string;

  @IsString({ message: CreateUserMessages.password.invalidFormat })
  @Length(6, 12, { message: CreateUserMessages.password.lengthField })
  public password: string;

  @IsEmail({}, { message: CreateUserMessages.email.invalidFormat })
  public email: string;

  @IsIn(['usual', 'pro'], {
    message: CreateUserMessages.type.invalidFormat,
  })
  public type: UserType;

  @IsOptional()
  @IsString({ message: CreateUserMessages.avatarUrl.invalidFormat })
  public avatarUrl: string;
}
