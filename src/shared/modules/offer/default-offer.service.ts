import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferService } from './offer-service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferEntity } from './offer.entity.js';
import { UserEntity } from '../user/user.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { Types } from 'mongoose';
import { HttpError } from '../../libs/rest/index.js';
import { StatusCodes } from 'http-status-codes';

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
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
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
      ...authorPipeline,
    ])
      .exec();


    return result[0] ?? null;
  }

  public async find(count = DEFAULT_OFFER_COUNT): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate([
      ...addReviewsToOffer,
      ...authorPipeline,
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
    const user = await this.userModel.findById(hostId);

    return this.offerModel.aggregate([
      {
        $match: {
          _id: {$in: user?.favoriteOffers}
        },
      },
      {
        $set: {
          isFavorite: true,
        },
      },
      {$sort: {createdAt: SortType.Down}},
    ])
      .exec();
  }

  public async toggleFavorite(userId: string, offerId: string, isFavorite: boolean): Promise<boolean> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new HttpError(StatusCodes.NOT_FOUND, `User with id ${userId} not found.`, 'DefaultOfferService');
    }

    const offerObjectId = new Types.ObjectId(offerId);

    if (!isFavorite) {
      user.favoriteOffers.pull(offerObjectId);

      await user.save();
      return false;
    } else {
      user.favoriteOffers.push(offerObjectId);

      await user.save();
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
