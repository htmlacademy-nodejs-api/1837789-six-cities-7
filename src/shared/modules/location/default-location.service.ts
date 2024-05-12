import { LocationService } from './location-service.interface.js';
import { LocationEntity } from './location.entity.js';
import { Location } from '../../types/location.type.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

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

  public async findOrCreate(locationData: Location): Promise<DocumentType<LocationEntity>> {
    const existedLocation = await this.findByCoordinates(locationData.longitude, locationData.latitude);
    if (existedLocation) {
      return existedLocation;
    }
    return this.create(locationData);
  }

  private async create(locationData: Location): Promise<DocumentType<LocationEntity>> {
    const location = new LocationEntity(locationData);
    const result = await this.locationModel.create(location);
    this.logger.info(`New location with coordinates ${location.latitude} ${location.longitude} created`);

    return result;
  }
}
