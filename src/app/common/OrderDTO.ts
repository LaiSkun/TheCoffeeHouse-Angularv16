import { OrderDetailDTO } from "./OrderDetailDTO";

export interface OrderDTO {
  address: string;
  email: string;
  phone: string;
  totalPrice: number;
  username: string;
  orderDetails: OrderDetailDTO[];
}
