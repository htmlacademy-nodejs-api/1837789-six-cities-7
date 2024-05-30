import {BaseController, HttpError, HttpMethod, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import {Component} from '../../types/index.js';
import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';
import {Logger} from '../../libs/logger/index.js';
import {OfferService} from './offer-service.interface.js';
import {fillDTO} from '../../helpers/index.js';
import {OfferRdo} from './offer.rdo.js';
import {UpdateOfferRequest} from './update-offer-request.type.js';
import {StatusCodes} from 'http-status-codes';
import {CreateOfferRequest} from './create-offer-requset.type.js';
import { ParamOfferId } from './param-offerid.type.js';
import { ReviewRdo, ReviewService } from '../review/index.js';


@injectable()
export class OfferController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.ReviewService) private readonly reviewService: ReviewService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Put,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.indexId,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId/reviews',
      method: HttpMethod.Get,
      handler: this.getReviews,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
      ]
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create(
    {body}: CreateOfferRequest,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create(body);

    this.created(res, fillDTO(OfferRdo, result));
  }

  public async update({body, params}: UpdateOfferRequest, res: Response): Promise<void> {
    const updatedOffer = this.offerService.updateById(String(params.offerId), body);
    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async delete({params}: Request, res: Response): Promise<void> {
    const existsOffer = await this.offerService.deleteById(params.offerId);

    if (!existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with the specified ID:«${params.offerId}» not found.`,
        'OfferController',
      );
    }

    this.ok(res, existsOffer);
  }

  public async indexId({params}: Request<ParamOfferId>, res: Response): Promise<void> {
    const existsOffer = await this.offerService.findById(params.offerId);

    if (!existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with the specified ID:«${params.offerId}» not found.`,
        'OfferController',
      );
    }

    this.ok(res, fillDTO(OfferRdo, existsOffer));
  }

  public async getReviews({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    if (!await this.offerService.exists(params.offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController'
      );
    }

    const reviews = await this.reviewService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(ReviewRdo, reviews));
  }
}
