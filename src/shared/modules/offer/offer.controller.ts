import {BaseController, HttpError, HttpMethod} from '../../libs/rest/index.js';
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


@injectable()
export class OfferController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/:offer_id', method: HttpMethod.Put, handler: this.update});
    this.addRoute({path: '/:offer_id', method: HttpMethod.Delete, handler: this.delete});
    this.addRoute({path: '/:offer_id', method: HttpMethod.Get, handler: this.indexId});
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    console.info(offers);
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async create(
    {body}: CreateOfferRequest,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create(body);

    this.created(res, fillDTO(OfferRdo, result));
  }

  public async update({body, params}: UpdateOfferRequest, res: Response): Promise<void> {
    const offer = this.offerService.updateById(String(params.offer_id), body);
    const responseData = fillDTO(OfferRdo, offer);
    this.ok(res, responseData);
  }

  public async delete({params}: Request, res: Response): Promise<void> {
    const existsOffer = await this.offerService.deleteById(params.offer_id);

    if (!existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with the specified ID:«${params.offer_id}» not found.`,
        'OfferController',
      );
    }

    this.noContent(res, existsOffer);
  }

  public async indexId({params}: Request, res: Response): Promise<void> {
    const existsOffer = await this.offerService.findById(params.offer_id);

    if (!existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with the specified ID:«${params.offer_id}» not found.`,
        'OfferController',
      );
    }

    this.ok(res, fillDTO(OfferRdo, existsOffer));
  }
}
