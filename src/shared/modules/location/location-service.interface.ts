import { LocationEntity } from './location.entity.js';
import { Location } from '../../types/location.type.js';
import { DocumentType } from '@typegoose/typegoose';
import { CreateLocationDto } from './create-location.dto.js';

export interface LocationService {
  create(dto: CreateLocationDto): Promise<DocumentType<LocationEntity>>;

  findOrCreate(locationData: Location): Promise<DocumentType<LocationEntity>>;

  findById(id: number): Promise<DocumentType<LocationEntity> | null>;

  findByCoordinates(cityLongitude: number, cityLatitude: number): Promise<DocumentType<LocationEntity> | null>;
}
