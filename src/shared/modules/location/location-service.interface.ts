import { LocationEntity } from './location.entity.js';
import { Location } from '../../types/location.type.js';
import { DocumentType } from '@typegoose/typegoose';

export interface LocationService {

  findOrCreate(locationData: Location): Promise<DocumentType<LocationEntity>>;

  findById(id: number): Promise<DocumentType<LocationEntity> | null>;

  findByCoordinates(cityLongitude: number, cityLatitude: number): Promise<DocumentType<LocationEntity> | null>;
}
