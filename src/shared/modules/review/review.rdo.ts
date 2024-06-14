import {Expose, Type} from 'class-transformer';
import {UserRdo} from '../user/user.rdo.js';

export class ReviewRdo {
  @Expose()
  public id: string;

  @Expose()
  public offerId: string;

  @Expose()
  public comment: string;

  @Expose()
  public rating: number;

  @Expose()
  @Type(() => UserRdo)
  public author: UserRdo;

  @Expose()
  public date: string;
}
