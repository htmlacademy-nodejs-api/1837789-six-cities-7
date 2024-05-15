import { DefaultReviewService } from './default-review.service.js';
import { ReviewService } from './review-service.interface.js';
import { ReviewEntity, ReviewModel } from './review.entity.js';
import { Component } from '../../types/component.enum.js';
import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';

export function createReviewContainer(): Container {
  const reviewContainer = new Container();
  reviewContainer.bind<types.ModelType<ReviewEntity>>(Component.ReviewModel).toConstantValue(ReviewModel);
  reviewContainer.bind<ReviewService>(Component.ReviewService).to(DefaultReviewService).inSingletonScope();

  return reviewContainer;
}
