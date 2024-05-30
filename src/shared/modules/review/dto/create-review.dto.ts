import { CreatereviewMessages } from './create-review.messages.js';
import { IsInt, IsMongoId, IsString, Length, Max, Min, IsDateString } from 'class-validator';

export class CreateReviewDto {
  @IsMongoId({message: CreatereviewMessages.offerId.invalidFormat})
  public offerId: string;

  @IsString({message: CreatereviewMessages.comment.invalidFormat})
  @Length(5, 1024, {message: CreatereviewMessages.comment.lengthField})
  public comment: string;

  @IsDateString({}, { message: CreatereviewMessages.publishDate.invalidFormat })
  public publishDate: Date;

  @IsInt({message: CreatereviewMessages.rating.invalidFormat})
  @Min(1, {message: CreatereviewMessages.rating.minValue})
  @Max(5, {message: CreatereviewMessages.rating.maxValue})
  public rating: number;

  @IsMongoId({message: CreatereviewMessages.hostId.invalidFormat})
  public hostId: string;
}
