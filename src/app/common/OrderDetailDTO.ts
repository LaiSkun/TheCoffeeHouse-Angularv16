import { ProductDTO } from "./ProductDTO";

export interface OrderDetailDTO{
  price: number;
  quantity: number;
  product: ProductDTO[];
  size: string;
  toppingname: string;
}
