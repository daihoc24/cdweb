declare class OrderProductDto {
    products_id: number;
    quantity: number;
}
export declare class CreateOrderDto {
    user_id: number;
    address: string;
    orderProducts: OrderProductDto[];
    phiShip: number;
}
export {};
