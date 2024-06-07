import {Expose, Type} from 'class-transformer';
import {UserRdo} from '../user/user.rdo.js';

export class OfferRdo {

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public publicDate: string;

  @Expose()
  public city: string;

  @Expose()
  public previewImage: string;

  @Expose()
  public images: string;

  @Expose()
  public isPremium: string;

  @Expose()
  public isFavorite: string;

  @Expose()
  public type: string;

  @Expose()
  public room: string;

  @Expose()
  public bedroom: string;

  @Expose()
  public price: string;

  @Expose()
  public goods: string;

  @Expose()
  public location: string;

  @Expose()
  @Type(() => UserRdo)
  public author: UserRdo;

  @Expose()
  public rating: string;

  @Expose()
  public reviewCount: string;
}
