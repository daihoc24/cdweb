export interface Comment {
  id: number;
  author: string;
  text: string;
}
export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface dataProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  type: string;
  comments: any[]; // Use a more specific type if you know the structure of comments
}
export interface listProduct {
  products_id: number;
  products_name: string;
  products_price: number;
  products_image: string;
  quantitySold:number;
  products_type: string;
}
export interface addComment {
  user_id: number;
  user_fullname: string;
  content: string;
}
export interface addProduct {
  products_name: string;
  products_price: number;
  products_type: string;
}
export interface Comment {
  comment_id: number;
  user_id: number;
  product_id: number;
  user_fullname: string;
  content: string;
  created_at: string;
}
export type ProductResponse = HttpResponse<listProduct[]>;

