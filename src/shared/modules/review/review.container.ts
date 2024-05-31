import { DefaultReviewService } from './default-review.service.js';
import { ReviewService } from './review-service.interface.js';
import { ReviewEntity, ReviewModel } from './review.entity.js';
import { Component } from '../../types/component.enum.js';
import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { Controller } from '../../libs/rest/index.js';
import { ReviewController } from './review.controller.js';

export function createReviewContainer(): Container {
  const reviewContainer = new Container();
  reviewContainer.bind<types.ModelType<ReviewEntity>>(Component.ReviewModel).toConstantValue(ReviewModel);
  reviewContainer.bind<ReviewService>(Component.ReviewService).to(DefaultReviewService).inSingletonScope();
  reviewContainer.bind<Controller>(Component.ReviewController).to(ReviewController).inSingletonScope();

  return reviewContainer;
}
