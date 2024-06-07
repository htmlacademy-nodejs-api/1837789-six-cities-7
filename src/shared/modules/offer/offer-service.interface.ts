import { DocumentType } from '@typegoose/typegoose';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { DocumentExists } from '../../types/index.js';

export interface OfferService extends DocumentExists {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string, currentHostId?: string): Promise<DocumentType<OfferEntity> | null>;
  find(currentHostId?: string, count?: number): Promise<DocumentType<OfferEntity>[]>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  findPremiumByCity(cityName: string): Promise<DocumentType<OfferEntity>[]>;
  findFavorites(hostId: string): Promise<DocumentType<OfferEntity>[]>;
  toggleFavorite(hostId: string, offerId: string, isFavorite: boolean): Promise<boolean>;
  incReviewCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  exists(documentId: string): Promise<boolean>;
}
