import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferService } from './offer-service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { Types } from 'mongoose';
import { HttpError } from '../../libs/rest/index.js';
import { StatusCodes } from 'http-status-codes';
import { DEFAULT_PREVIEW_IMAGE_FILE_NAME } from './offer.constant.js';

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

const authorPipeline = [
  {
    $lookup: {
      from: 'users',
      localField: 'hostId',
      foreignField: '_id',
      as: 'users',
    },
  },
  {
    $addFields: {
      author: { $arrayElemAt: ['$users', 0] },
    },
  },
  {
    $unset: ['users'],
  },
];

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create({ ...dto, previewImage: DEFAULT_PREVIEW_IMAGE_FILE_NAME });
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string, currentHostId?: string): Promise<DocumentType<OfferEntity> | null> {
    const result = await this.offerModel.aggregate([
      {$addFields: {id: offerId}},
      {
        $match: { _id: new Types.ObjectId(offerId) }
      },
      {$set: {isFavorite: {$in: [new Types.ObjectId(currentHostId), '$favorites']}}},
      ...addReviewsToOffer,
      ...authorPipeline,
    ])
      .exec();


    return result[0] ?? null;
  }

  public async find(currentHostId?: string, count?: number,): Promise<DocumentType<OfferEntity>[]> {
    const limit = count || DEFAULT_OFFER_COUNT;
    return this.offerModel.aggregate([
      {$addFields: {id: {$toString: '$_id'}}},
      {$set: {isFavorite: {$in: [new Types.ObjectId(currentHostId), '$favorites']}}},
      ...addReviewsToOffer,
      ...authorPipeline,
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
      .populate(['hostId'])
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

  public async findFavorites(hostId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate([
      {$match: {$expr: {$in: [new Types.ObjectId(hostId), '$favorites']}}},
      {$set: {isFavorite: {$in: [new Types.ObjectId(hostId), '$favorites']}}},
      {$sort: {createdAt: SortType.Down}},
    ])
      .exec();
  }

  public async toggleFavorite(hostId: string, offerId: string, isFavorite: boolean): Promise<boolean> {
    const offer = await this.offerModel.findById(offerId).exec();

    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${offerId} not found.`, 'DefaultOfferService');
    }

    const userObjectId = new Types.ObjectId(hostId);

    if (!isFavorite) {
      offer?.favorites.pull(userObjectId);

      await offer?.save();
      return false;

    } else {
      offer?.favorites.push(userObjectId);

      await offer?.save();
      return true;
    }
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
