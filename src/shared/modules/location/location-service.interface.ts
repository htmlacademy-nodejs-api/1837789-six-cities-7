import { LocationEntity } from './location.entity.js';
import { DocumentType } from '@typegoose/typegoose';
import { CreateLocationDto } from './index.js';

export interface LocationService {

  findOrCreate(dto: CreateLocationDto): Promise<DocumentType<LocationEntity>>;

  findById(id: number): Promise<DocumentType<LocationEntity> | null>;

  findByCoordinates(cityLongitude: number, cityLatitude: number): Promise<DocumentType<LocationEntity> | null>;
}
