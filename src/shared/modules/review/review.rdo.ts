import { Expose } from 'class-transformer';

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
  public hostId: string;
}
