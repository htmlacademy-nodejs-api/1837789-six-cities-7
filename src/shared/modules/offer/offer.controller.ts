import {
  BaseController,
  HttpMethod,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
  DocumentExistsMiddleware,
  PrivateRouteMiddleware,
  UploadFileMiddleware,
  RequestBody
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
import { Config, RestSchema } from '../../libs/config/index.js';
import { UploadImageRdo } from './upload-offer-image.rdo.js';

@injectable()
export class OfferController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.ReviewService) private readonly reviewService: ReviewService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
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
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.showFavoritesOffers,
      middlewares: [
        new PrivateRouteMiddleware()
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
    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Post,
      handler: this.postFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        ...middlewares,
      ],
    });
    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        ...middlewares,
      ],
    });
    this.addRoute({
      path: '/:offerId/image',
      method: HttpMethod.Post,
      handler: this.uploadImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'previewImage'),
      ]
    });
  }

  public async index({tokenPayload}: Request<ParamOfferId>, res: Response): Promise<void> {
    const offers = await this.offerService.find(tokenPayload?.id);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create(
    {body, tokenPayload }: CreateOfferRequest,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create({ ...body, hostId: tokenPayload.id });

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

  public async indexId({params, tokenPayload}: Request<ParamOfferId>, res: Response): Promise<void> {
    const existsOffer = await this.offerService.findById(params.offerId, tokenPayload?.id);
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

  public async showFavoritesOffers({tokenPayload: { id }}: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findFavorites(id);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async deleteFavorite(
    { params, tokenPayload}: Request<ParamOfferId, RequestBody, { isFavorite: string }>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    const isFavorite = false;
    const hostId = tokenPayload.id;

    const offer = await this.offerService.toggleFavorite(hostId, offerId, isFavorite);

    this.ok(res, {
      favorites: offer,
    });
  }

  public async postFavorite(
    { params, tokenPayload}: Request<ParamOfferId, RequestBody, { isFavorite: string }>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    const isFavorite = true;
    const hostId = tokenPayload.id;

    const offer = await this.offerService.toggleFavorite(hostId, offerId, isFavorite);

    this.ok(res, {
      favorites: offer,
    });
  }

  public async uploadImage({ params, file } : Request<ParamOfferId>, res: Response) {
    const { offerId } = params;
    const updateDto = { previewImage: file?.filename };
    await this.offerService.updateById(offerId, updateDto);
    this.created(res, fillDTO(UploadImageRdo, updateDto));
  }
}
