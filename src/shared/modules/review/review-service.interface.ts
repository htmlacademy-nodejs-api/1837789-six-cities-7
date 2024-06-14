import { ReviewEntity } from './review.entity.js';
import { DocumentType } from '@typegoose/typegoose';
import { CreateReviewDto } from './index.js';

export interface ReviewService {
  create(dto: CreateReviewDto): Promise<DocumentType<ReviewEntity>>;
  findByOfferId(offerId: string): Promise<DocumentType<ReviewEntity>[]>;
  deleteByOfferId(offerId: string): Promise<number | null>;
}
