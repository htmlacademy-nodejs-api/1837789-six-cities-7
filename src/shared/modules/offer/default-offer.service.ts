import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferService } from './offer-service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './create-offer.dto.js';
import { UpdateOfferDto } from './update-offer.dto.js';
import { Types } from 'mongoose';

export const DEFAULT_OFFER_PREMIUM_COUNT = 3;
export const DEFAULT_OFFER_COUNT = 60;

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const result = await this.offerModel.aggregate([
      {
        $match: { _id: new Types.ObjectId(offerId) }
      },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'offerId',
          as: 'reviews',
        }
      },
      {
        $addFields: {
          reviewCount: {$size: '$reviews'},
          rating: {$avg: '$reviews.rating'},
        }
      },
      {
        $unset: 'reviews'
      }
    ])
      .exec();


    return result[0] ?? null;
  }

  public async find(count?: number): Promise<DocumentType<OfferEntity>[]> {
    // return this.offerModel.find().populate(['userId']).exec();
    const limit = count ?? DEFAULT_OFFER_COUNT;
    return this.offerModel.aggregate([
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'offerId',
          as: 'reviews',
        }
      },
      {
        $addFields: {
          reviewCount: {$size: '$reviews'},
          rating: {$avg: '$reviews.rating'},
        }
      },
      { $unset: ['reviews'] },
      { $sort: { createdAt: SortType.Down } },
      { $limit: limit },
    ])
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId);
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true})
      .populate(['userId'])
      .exec();
  }

  public async findPremium(count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? DEFAULT_OFFER_PREMIUM_COUNT;
    return this.offerModel
      .find({premium: true})
      .sort({createdAt: SortType.Down})
      .limit(limit)
      .populate(['userId'])
      .exec();
  }

  public async findFavorites(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({favorites: true})
      .sort({createdAt: SortType.Down})
      .populate(['userId'])
      .exec();
  }

  public async incReviewCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        '$inc': {
          reviewCount: 1,
        }}).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({_id: documentId})) !== null;
  }
}
