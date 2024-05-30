import { OfferType, City, Location } from '../../../types/index.js';

export class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public publicDate?: Date;
  public city?: City;
  public previewImage?: string;
  public images?: string[];
  public isPremium?: boolean;
  public isFavorite?: boolean;
  public rating?: number;
  public type?: OfferType;
  public room?: number;
  public bedroom?: number;
  public price?: number;
  public goods?: string[];
  public hostId?: string;
  public location?: Location;
}
