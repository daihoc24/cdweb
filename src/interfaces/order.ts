export interface Order {
    order_id: number;
    totalAmount: number;
    status: string;
    phiShip: number;
    thoiGian: string;
    user_id: number;
    createdAt: string;
    address: string;
    User: User;
    OrderProduct: OrderProduct[];
}

export interface User {
    user_fullname: string;
    user_phone: string;
}

export interface OrderProduct {
    quantity: number;
    Product: Product;
}

export interface Product {
    products_id: number;
    products_name: string;
    products_price: number;
    products_image: string;
}