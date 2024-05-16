import { OfferType } from '../../types/offer.type.js';

export class CreateOfferDto {
  public title: string;
  public description: string;
  public publicDate: Date;
  public cityId: string;
  public previewImage: string;
  public images: string[];
  public isPremium: boolean;
  public isFavorite: boolean;
  public rating: number;
  public type: OfferType;
  public room: number;
  public bedroom: number;
  public price: number;
  public goods: string[];
  public hostId: string;
  public locationId: string;
}
