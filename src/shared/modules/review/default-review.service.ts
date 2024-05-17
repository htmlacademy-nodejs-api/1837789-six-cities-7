import { ReviewService } from './review-service.interface.js';
import { ReviewEntity } from './review.entity.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { CreateReviewDto } from './index.js';

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

  public async findById(id: number): Promise<DocumentType<ReviewEntity> | null> {
    return this.reviewModel.findById(id);
  }

  public async findOrCreate(_dto: CreateReviewDto): Promise<DocumentType<ReviewEntity>> {
    throw new Error('Method not implemented.');
  }

  public async find(): Promise<DocumentType<ReviewEntity>[]> {
    return this.reviewModel.find();
  }
}
