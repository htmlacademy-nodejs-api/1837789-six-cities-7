import { ReviewEntity } from './review.entity.js';
import { DocumentType } from '@typegoose/typegoose';
import { CreateReviewDto } from './index.js';

export interface ReviewService {
  findOrCreate(dto: CreateReviewDto): Promise<DocumentType<ReviewEntity>>;
  find(): Promise<DocumentType<ReviewEntity>[]>;
  findById(id: number): Promise<DocumentType<ReviewEntity> | null>;
}
