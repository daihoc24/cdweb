export interface OrderData {
    sonha: string;
    phuong: string;
    phiShip: number;
    huyen: string;
    tinh: string;
}
export interface updateOrdedrFormValues {
    sonha: string;
    ward: string;
    district: string;
    province: string; status: string;
    orderProducts: createOrderProduct[];
}
export interface updateOrder {
    address: string;
    status: string;
    orderProducts: createOrderProduct[];
}
export interface createOrder {
    user_id: number | null;
    address: string;
    orderProducts: createOrderProduct[];
    phiShip: number;
}
interface createOrderProduct {
    products_id: number;
    quantity: number;
}
export interface Product {
    products_id: number;
    products_name: string;
    products_price: number;
    products_image: string;
}

export interface OrderProduct {
    quantity: number;
    Product: Product;
}

export interface User {
    user_fullname: string;
    user_phone: string;
}

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