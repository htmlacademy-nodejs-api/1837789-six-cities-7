import { CreateReviewMessages } from './create-review.messages.js';
import { IsInt, IsString, Length, Max, Min } from 'class-validator';

export class CreateReviewDto {
  public offerId: string;

  @IsString({message: CreateReviewMessages.comment.invalidFormat})
  @Length(5, 1024, {message: CreateReviewMessages.comment.lengthField})
  public comment: string;

  public publishDate: Date;

  @IsInt({message: CreateReviewMessages.rating.invalidFormat})
  @Min(1, {message: CreateReviewMessages.rating.minValue})
  @Max(5, {message: CreateReviewMessages.rating.maxValue})
  public rating: number;

  public hostId: string;
}
