import { CreateReviewMessages } from './create-review.messages.js';
import { IsInt, IsMongoId, IsString, Length, Max, Min, IsDateString } from 'class-validator';

export class CreateReviewDto {
  @IsMongoId({message: CreateReviewMessages.offerId.invalidFormat})
  public offerId: string;

  @IsString({message: CreateReviewMessages.comment.invalidFormat})
  @Length(5, 1024, {message: CreateReviewMessages.comment.lengthField})
  public comment: string;

  @IsDateString({strict: true}, { message: CreateReviewMessages.publishDate.invalidFormat })
  public publishDate: Date;

  @IsInt({message: CreateReviewMessages.rating.invalidFormat})
  @Min(1, {message: CreateReviewMessages.rating.minValue})
  @Max(5, {message: CreateReviewMessages.rating.maxValue})
  public rating: number;

  public hostId: string;
}
