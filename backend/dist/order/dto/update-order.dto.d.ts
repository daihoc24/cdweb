declare class UpdateOrderProductDto {
    products_id: number;
    quantity: number;
}
export declare class UpdateOrderDto {
    status?: string;
    address: string;
    orderProducts?: UpdateOrderProductDto[];
}
export {};
