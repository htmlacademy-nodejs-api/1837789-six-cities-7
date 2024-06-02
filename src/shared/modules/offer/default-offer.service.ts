import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferService } from './offer-service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { Types } from 'mongoose';

export const DEFAULT_OFFER_PREMIUM_COUNT = 3;
export const DEFAULT_OFFER_COUNT = 60;

const addReviewsToOffer = [
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
];

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
      ...addReviewsToOffer,
    ])
      .exec();


    return result[0] ?? null;
  }

  public async find(count = DEFAULT_OFFER_COUNT): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate([
      ...addReviewsToOffer,
      { $sort: { createdAt: SortType.Down } },
      { $limit: count },
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
      .populate(['hostId'])
      .exec();
  }

  public async findPremium(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate([
      {
        $match: {isPremium: true}
      },
      ...addReviewsToOffer,
      {$sort: {createdAt: SortType.Down}},
      {$limit: DEFAULT_OFFER_PREMIUM_COUNT},
    ])
      .exec();
  }

  public async findPremiumByCity(cityName: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate([
      {
        $match: {
          'city.name': cityName,
          isPremium: true
        }
      },
      ...addReviewsToOffer,
      {$sort: {createdAt: SortType.Down}},
      {$limit: DEFAULT_OFFER_PREMIUM_COUNT},
    ])
      .exec();
  }

  public async findFavorites(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({isFavorite: true})
      .sort({createdAt: SortType.Down})
      .populate(['hostId'])
      .exec();
  }

  public async incReviewCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        '$inc': {
          reviewCount: 1,
        }}, {new: true}).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({_id: documentId})) !== null;
  }
}
