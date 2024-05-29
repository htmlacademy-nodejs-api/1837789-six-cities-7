import {
  BaseController,
  HttpError,
  HttpMethod,
  RequestQuery
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
import { CreateReviewRequest } from './index.js';

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
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
    });
    this.addRoute({
      path: '/offerId',
      method: HttpMethod.Get,
      handler: this.findByOfferId,
    });
  }

  public async findByOfferId({params, query}: Request<ParamOfferId, unknown, unknown, RequestQuery>, res: Response) {
    const { offerId } = params;
    const { limit } = query;
    const reviews = await this.reviewService.findByOfferId(offerId, !isNaN(Number(limit)) ? Number(limit) : undefined);
    this.ok(res, fillDTO(ReviewRdo, reviews));
  }

  public async create({body}: CreateReviewRequest, res: Response) {

    if (! await this.offerService.exists(body.offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${body.offerId} not found.`,
        'ReviewsController'
      );
    }

    const review = this.reviewService.create(body);
    await this.offerService.incReviewCount(body.offerId);
    this.created(res, fillDTO(ReviewRdo, review));
  }
}
