import { CityService } from './city-service.interface.js';
import { CityEntity } from './city.entity.js';
import { LocationService } from '../location/index.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/index.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import { CreateCityDto } from './create-city.dto.js';

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

  public async findOrCreate(dto: CreateCityDto): Promise<DocumentType<CityEntity>> {
    const existingCity = await this.findByName(dto.name);
    if (existingCity) {
      return existingCity;
    }
    return this.create(dto);
  }

  private async create(dto: CreateCityDto): Promise<DocumentType<CityEntity>> {
    const {location: locationData} = dto;
    const location = await this.locationService.findOrCreate(locationData);

    const city = new CityEntity(dto, location.id);
    const result = await this.cityModel.create(city);
    this.logger.info(`New city created: ${city.name}`);

    return result;
  }
}
