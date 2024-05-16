import { LocationService } from './location-service.interface.js';
import { LocationEntity } from './location.entity.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { CreateLocationDto } from './index.js';

@injectable()
export class DefaultLocationService implements LocationService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.LocationModel) private readonly locationModel: types.ModelType<LocationEntity>,
  ) {
  }

  public async findById(locationId: number): Promise<DocumentType<LocationEntity> | null> {
    return this.locationModel.findById(locationId);
  }

  public async findByCoordinates(cityLongitude: number, cityLatitude: number): Promise<DocumentType<LocationEntity> | null> {
    return this.locationModel.findOne({longitude: cityLongitude, latitude: cityLatitude});
  }

  public async findOrCreate(dto: CreateLocationDto): Promise<DocumentType<LocationEntity>> {
    const existedLocation = await this.findByCoordinates(dto.longitude, dto.latitude);
    if (existedLocation) {
      return existedLocation;
    }
    return this.create(dto);
  }

  private async create(dto: CreateLocationDto): Promise<DocumentType<LocationEntity>> {
    const location = new LocationEntity(dto);
    const result = await this.locationModel.create(location);
    this.logger.info(`New location with coordinates ${location.latitude} ${location.longitude} created`);

    return result;
  }
}
