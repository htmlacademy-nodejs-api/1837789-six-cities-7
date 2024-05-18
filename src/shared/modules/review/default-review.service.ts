import { ReviewService } from './review-service.interface.js';
import { ReviewEntity } from './review.entity.js';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { CreateReviewDto } from './index.js';

const DEFAULT_REVIEW_COUNT = 50;

@injectable()
export class DefaultReviewService implements ReviewService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.ReviewModel) private readonly reviewModel: types.ModelType<ReviewEntity>,
  ) {
  }

  public async create(dto: CreateReviewDto): Promise<DocumentType<ReviewEntity>> {
    const result = await this.reviewModel.create(dto);
    this.logger.info(`New review with publish date ${result.publishDate} created`);

    return result;
  }

  public async findByOfferId(offerId: string, count?: number): Promise<DocumentType<ReviewEntity>[]> {
    const limit = count ?? DEFAULT_REVIEW_COUNT;
    return this.reviewModel
      .find({offerId})
      .sort({createdAt: SortType.Down})
      .limit(limit)
      .populate('userId');
  }

  public async deleteByOfferId(offerId: string): Promise<number | null> {
    const result = await this.reviewModel.deleteMany({offerId});

    return result.deletedCount;
  }
}
