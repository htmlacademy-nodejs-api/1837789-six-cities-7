import { City } from '../../types/city.type.js';
import { Location } from '../../types/location.type.js';
import { OfferType } from '../../types/offer.type.js';
import { User } from '../../types/user.type.js';

export class CreateOfferDto {
  constructor(
    public title: string,
    public description: string,
    public publicDate: Date,
    public city: City,
    public previewImage: string,
    public images: string[],
    public isPremium: boolean,
    public isFavorite: boolean,
    public rating: number,
    public type: OfferType,
    public room: number,
    public bedroom: number,
    public price: number,
    public goods: string[],
    public host: User,
    public location: Location
  ) {
  }
}
