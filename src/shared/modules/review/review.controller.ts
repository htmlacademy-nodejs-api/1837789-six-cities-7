import {
  BaseController,
  HttpError,
  HttpMethod,
  RequestQuery,
  ValidateObjectIdMiddleware,
  ValidateDtoMiddleware,
  DocumentExistsMiddleware,
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
import { ParamOfferId } from '../offer/param-offerid.type.js';
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
      path: '/offerId',
      method: HttpMethod.Get,
      handler: this.findByOfferId,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'id'),
      ]
    });
  }

  public async findByOfferId({ params, query }: Request<ParamOfferId, unknown, unknown, RequestQuery>, res: Response) {
    const { offerId } = params;
    const { limit } = query;
    const reviews = await this.reviewService.findByOfferId(offerId, Number(limit) || undefined);
    this.ok(res, fillDTO(ReviewRdo, reviews));
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
}
