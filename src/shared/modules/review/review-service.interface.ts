import { ReviewEntity } from './review.entity.js';
import { Review } from '../../types/review.type.js';
import { DocumentType } from '@typegoose/typegoose';

export interface ReviewService {
  findOrCreate(reviewData: Review): Promise<DocumentType<ReviewEntity>>;

  findById(id: number): Promise<DocumentType<ReviewEntity> | null>;
}
