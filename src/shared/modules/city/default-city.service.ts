import { CityService } from './city-service.interface.js';
import { CityEntity } from './city.entity.js';
import { City } from '../../types/city.type.js';
import { LocationService } from '../location/index.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/index.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';

@injectable()
export class DefaultCityService implements CityService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CityModel) private readonly cityModel: types.ModelType<CityEntity>,
    @inject(Component.LocationService) private readonly locationService: LocationService,
  ) {
  }

  public async findById(cityId: number): Promise<DocumentType<CityEntity> | null> {
    return this.cityModel.findById(cityId);
  }

  public async findByName(cityName: string): Promise<DocumentType<CityEntity> | null> {
    return this.cityModel.findOne({name: cityName});
  }

  public async findOrCreate(cityData: City): Promise<DocumentType<CityEntity>> {
    const existedCity = await this.findByName(cityData.name);
    if (existedCity) {
      return existedCity;
    }
    return this.create(cityData);
  }

  private async create(cityData: City): Promise<DocumentType<CityEntity>> {
    const {location: locationData} = cityData;
    const location = await this.locationService.findOrCreate(locationData);

    const city = new CityEntity(cityData, location.id);
    const result = await this.cityModel.create(city);
    this.logger.info(`New city created: ${city.name}`);

    return result;
  }
}
