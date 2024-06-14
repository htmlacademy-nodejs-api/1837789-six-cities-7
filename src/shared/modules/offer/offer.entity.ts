import { Location, City, User, OfferType } from '../../types/index.js';
import { UserEntity } from '../user/index.js';
import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({required: true})
  public title: string;

  @prop({required: true, enum: OfferType})
  public type: OfferType;

  @prop({required: true})
  public bedroom: number;

  @prop({required: true})
  public city: City;

  @prop({required: true})
  public description: string;

  @prop({required: true, type: [String]})
  public goods: string[];

  @prop({required: true, ref: UserEntity})
  public hostId: Ref<UserEntity>;

  public autor: User;

  @prop({required: false, type: [String]})
  public images: string[];

  @prop({required: false})
  public isFavorite: boolean;

  @prop({required: true})
  public isPremium: boolean;

  @prop({required: true})
  public location: Location;

  @prop({required: false})
  public previewImage: string;

  @prop({required: true})
  public price: number;

  @prop({required: false})
  public publicDate: Date;

  @prop({required: true})
  public room: number;

  @prop({type: Types.ObjectId, required: true, default: []})
  public favorites: Types.Array<Types.ObjectId>;
}

export const OfferModel = getModelForClass(OfferEntity);
