import {UserDTO} from './user.dto';

export class ReviewDTO {
  public id!: string;
  public date!: string;
  public comment!: string;
  public rating!: number;
  public author!: UserDTO;
}
