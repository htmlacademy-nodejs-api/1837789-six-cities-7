import { City } from './city.type.js';
import { Location } from './location.type.js';
import { OfferType } from './offer.type.js';
import { UserType } from './user.type.js';

export type MockServerData = {
  titles: string[];
  descriptions: string[];
  cities: City[];
  previewImages: string[];
  images: string[];
  isPremium: boolean[];
  isFavorite: boolean[];
  types: OfferType[];
  goods: string[];
  hostNames: string[];
  hostEmails: string[];
  hostAvatarUrls: string[];
  hostPasswords: string[];
  hostTypes: UserType[];
  locations: Location[];
}
