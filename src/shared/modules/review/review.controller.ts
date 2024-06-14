import {
  BaseController,
  HttpError,
  HttpMethod,
  ValidateDtoMiddleware,
  PrivateRouteMiddleware
} from '../../libs/rest/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { ReviewService } from './review-service.interface.js';
import { Request, Response } from 'express';
import { OfferService } from '../offer/index.js';
import { StatusCodes } from 'http-status-codes';
import { ReviewRdo } from './review.rdo.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateReviewDto } from './dto/create-review.dto.js';


@injectable()
export class ReviewController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.ReviewService) private readonly reviewService: ReviewService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for ReviewsController...');

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateReviewDto)
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
    });
  }

  public async create({ params, body, tokenPayload }:Request, res: Response) {
    const { offerId } = params;
    if (! await this.offerService.exists(offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'ReviewsController'
      );
    }

    const review = await this.reviewService.create({ offerId, ...body, hostId: tokenPayload.id});
    this.created(res, fillDTO(ReviewRdo, review));
  }

  public async delete(
    { params }: Request,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    const countReviews = await this.reviewService.deleteByOfferId(offerId);

    this.ok(res, {
      numberOfDeletedReviews: countReviews,
    });
  }
}
