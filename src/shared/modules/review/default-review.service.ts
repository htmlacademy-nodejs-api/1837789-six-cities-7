import { ReviewService } from './review-service.interface.js';
import { ReviewEntity } from './review.entity.js';
import { Review } from '../../types/review.type.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

@injectable()
export class DefaultReviewService implements ReviewService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.ReviewModel) private readonly reviewModel: types.ModelType<ReviewEntity>,
  ) {
  }

  public async create(reviewData: Review): Promise<DocumentType<ReviewEntity>> {
    const review = new ReviewEntity(reviewData);
    const result = await this.reviewModel.create(review);
    this.logger.info(`New review with publish date ${review.publishDate} created`);

    return result;
  }

  public async findById(id: number): Promise<DocumentType<ReviewEntity> | null> {
    return this.reviewModel.findById(id);
  }

  public async fineOrCreate(_reviewData: Review): Promise<DocumentType<ReviewEntity>> {
    throw new Error('Method not implemented.');
  }
}
