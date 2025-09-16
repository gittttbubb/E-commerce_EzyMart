import { UserResponse } from "../responses/user/user.response";

export interface Comment {
  id: number;
  content: string;
  user: UserResponse; 
  productId: number;
  createdAt: string;
  updatedAt: string;
}
