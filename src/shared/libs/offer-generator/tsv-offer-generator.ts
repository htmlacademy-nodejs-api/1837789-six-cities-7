import dayjs from 'dayjs';
import { GeneratorConfig } from './generator-config.js';
import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData } from '../../types/index.js';
import { generateRandomValue, getRandomItem, getRandomItems, getRandomImages } from '../../helpers/index.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {

    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const publicDate = dayjs()
      .subtract(generateRandomValue(GeneratorConfig.firstWeekDay, GeneratorConfig.lastWeekDay), 'day')
      .toISOString();
    const city = getRandomItem(this.mockData.cities);
    const previewImage = getRandomItem(this.mockData.previewImages);
    const images = getRandomImages(this.mockData.images).join(';');
    const isPremium = getRandomItem(this.mockData.isPremium);
    const isFavorite = getRandomItem(this.mockData.isFavorite);
    const rating = generateRandomValue(GeneratorConfig.minRating, GeneratorConfig.maxRating);
    const type = getRandomItem(this.mockData.types);
    const room = generateRandomValue(GeneratorConfig.minRoom, GeneratorConfig.maxRoom);
    const bedroom = generateRandomValue(GeneratorConfig.minBedroom, GeneratorConfig.maxBedroom);
    const price = generateRandomValue(GeneratorConfig.minPrice, GeneratorConfig.maxPrice);
    const goods = getRandomItems(this.mockData.goods).join(';');
    const hostName = getRandomItem(this.mockData.hostNames);
    const hostEmail = getRandomItem(this.mockData.hostEmails);
    const hostAvatar = getRandomItem(this.mockData.hostAvatarUrls);
    const hostPassword = getRandomItem(this.mockData.hostPasswords);
    const hostType = getRandomItem(this.mockData.hostTypes);
    const location = city.location;

    return [
      title, description, publicDate, city.name, city.location.latitude, city.location.longitude,
      previewImage, images, isPremium, isFavorite, rating, type, room, bedroom, price, goods,
      hostName, hostEmail, hostAvatar, hostPassword, hostType, location.latitude, location.longitude
    ].join('\t');
  }
}
