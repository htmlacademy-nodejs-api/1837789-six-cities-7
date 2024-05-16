import { CityEntity } from './city.entity.js';
import { DocumentType } from '@typegoose/typegoose';
import { CreateCityDto } from './create-city.dto.js';

export interface CityService {
  findOrCreate(dto: CreateCityDto): Promise<DocumentType<CityEntity>>;

  findById(id: number): Promise<DocumentType<CityEntity> | null>;

  findByName(cityName: string): Promise<DocumentType<CityEntity> | null>;
}
