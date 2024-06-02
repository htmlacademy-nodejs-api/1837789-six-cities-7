import { DocumentType } from '@typegoose/typegoose';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { DocumentExists } from '../../types/index.js';

export interface OfferService extends DocumentExists {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  find(count: number | undefined): Promise<DocumentType<OfferEntity>[]>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  findPremium(): Promise<DocumentType<OfferEntity>[]>;
  findPremiumByCity(cityName: string): Promise<DocumentType<OfferEntity>[]>;
  findFavorites(): Promise<DocumentType<OfferEntity>[]>;
  incReviewCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  exists(documentId: string): Promise<boolean>;
}
