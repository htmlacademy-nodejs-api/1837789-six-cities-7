import { UserEntity } from '../user/index.js';
import { OfferEntity } from '../offer/index.js';
import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface ReviewEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'reviews',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class ReviewEntity extends defaultClasses.TimeStamps {
  @prop({required: true, ref: OfferEntity})
  public offerId: Ref<OfferEntity>;

  @prop({required: true, trim: true})
  public comment: string;

  @prop({required: true})
  public publishDate: Date;

  @prop({required: true})
  public rating: number;

  @prop({required: true, ref: UserEntity})
  public hostId: Ref<UserEntity>;
}

export const ReviewModel = getModelForClass(ReviewEntity);
