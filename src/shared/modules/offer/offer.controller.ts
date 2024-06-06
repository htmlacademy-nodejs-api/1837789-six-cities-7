import {
  BaseController,
  HttpMethod,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
  DocumentExistsMiddleware,
  PrivateRouteMiddleware,
} from '../../libs/rest/index.js';
import {Component} from '../../types/index.js';
import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';
import {Logger} from '../../libs/logger/index.js';
import {OfferService} from './offer-service.interface.js';
import {fillDTO} from '../../helpers/index.js';
import {OfferRdo} from './offer.rdo.js';
import {UpdateOfferRequest} from './update-offer-request.type.js';
import {CreateOfferRequest} from './create-offer-requset.type.js';
import { ParamOfferId } from './param-offerid.type.js';
import { ReviewRdo, ReviewService } from '../review/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';

@injectable()
export class OfferController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.ReviewService) private readonly reviewService: ReviewService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    const middlewares = [new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')];

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.showPremiumOffersByCity
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Put,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(UpdateOfferDto),
        ...middlewares,
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        ...middlewares,
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.indexId,
      middlewares
    });
    this.addRoute({
      path: '/:offerId/reviews',
      method: HttpMethod.Get,
      handler: this.getReviews,
      middlewares
    });
  }

  public async index({query}: Request, res: Response): Promise<void> {
    const count = typeof query.count === 'string' ? parseInt(query.count, 10) : undefined;
    const offers = await this.offerService.find(count);
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
    const updatedOffer = await this.offerService.updateById(String(params.offerId), body);
    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async delete({params}: Request, res: Response): Promise<void> {
    const existsOffer = await this.offerService.deleteById(params.offerId);
    this.ok(res, existsOffer);
  }

  public async indexId({params}: Request<ParamOfferId>, res: Response): Promise<void> {
    const existsOffer = await this.offerService.findById(params.offerId);
    this.ok(res, fillDTO(OfferRdo, existsOffer));
  }

  public async getReviews({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const reviews = await this.reviewService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(ReviewRdo, reviews));
  }

  public async showPremiumOffersByCity({ query }: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findPremiumByCity(query.cityName as string);
    this.ok(res, fillDTO(OfferRdo, offers));
  }
}
