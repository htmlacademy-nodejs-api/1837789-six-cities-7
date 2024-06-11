import { Expose } from 'class-transformer';

export class UserRdo {
  @Expose()
  public name: string;

  @Expose()
  public id: string;

  @Expose()
  public email: string;

  @Expose()
  public type: string;

  @Expose()
  public avatarUrl: string;
}
