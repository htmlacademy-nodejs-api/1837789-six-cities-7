import {User} from '../../types/index.js';

export class CreateReviewDto {
  public comment: string;
  public publishDate: Date;
  public rating: number;
  public author: User;
}
