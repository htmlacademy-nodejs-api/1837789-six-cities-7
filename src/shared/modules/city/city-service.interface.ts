import { CityEntity } from './city.entity.js';
import { City } from '../../types/city.type.js';
import { DocumentType } from '@typegoose/typegoose';

export interface CityService {
  findOrCreate(cityData: City): Promise<DocumentType<CityEntity>>;

  findById(id: number): Promise<DocumentType<CityEntity> | null>;

  findByName(cityName: string): Promise<DocumentType<CityEntity> | null>;
}
