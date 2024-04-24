import { readFileSync } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import { UserType, Offer, OfferType } from '../../types/index.js';

const stringToBoolean = (str: string): boolean => str === 'true';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  private validateRawData(): void {
    if (! this.rawData) {
      throw new Error('File was not read');
    }
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): Offer {
    const [title, description, publicDate, cityName, cityLocationLatitude, cityLocationLongitude,
      previewImage, images, isPremium, isFavorite, rating, type, room, bedroom, price, goods,
      hostName, hostEmail, hostAvatarUrl, hostPassword, hostType, offerLocationLatitude, offerLocationLongitude] = line.split('\t');

    return {
      title,
      description,
      publicDate: new Date(publicDate),
      city: {
        name: cityName,
        location: {
          latitude: Number(cityLocationLatitude),
          longitude: Number(cityLocationLongitude)
        }
      },
      previewImage,
      images: images.split(';'),
      isPremium: stringToBoolean(isPremium),
      isFavorite: stringToBoolean(isFavorite),
      rating: Number(rating),
      type: type as OfferType,
      room: Number(room),
      bedroom: Number(bedroom),
      price: Number(price),
      goods: goods.split(';'),
      host: {
        name: hostName,
        email: hostEmail,
        avatarUrl: hostAvatarUrl,
        password: hostPassword,
        type: hostType as UserType
      },
      location: {
        latitude: Number(offerLocationLatitude),
        longitude: Number(offerLocationLongitude)
      }
    };
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
