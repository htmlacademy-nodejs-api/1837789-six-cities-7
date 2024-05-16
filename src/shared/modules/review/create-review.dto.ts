import {User} from '../../types/index.js';

export class CreateReviewDto {
  public comment: string;
  public publishDate: Date;
  rating: number;
  author: User;
}
