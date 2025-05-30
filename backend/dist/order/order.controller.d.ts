import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { getData } from 'src/product/interface';
import { Response } from 'express';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    getListOrder(res: Response): Promise<void>;
    getListOrderByUserID(userId: number, res: Response): Promise<void>;
    getOrderById(orderId: number, res: Response): Promise<void>;
    createOrder(CreateOrderDto: CreateOrderDto): Promise<{
        user_id: number | null;
        status: string | null;
        address: string | null;
        phiShip: number | null;
        order_id: number;
        totalAmount: number | null;
        thoiGian: string | null;
        createdAt: Date | null;
    }>;
    updateOrder(id: string, body: UpdateOrderDto, req: getData): Promise<{
        user_id: number | null;
        status: string | null;
        address: string | null;
        phiShip: number | null;
        order_id: number;
        totalAmount: number | null;
        thoiGian: string | null;
        createdAt: Date | null;
    }>;
    deleteOrder(id: string, req: getData): Promise<{
        message: string;
        deletedOrder: {
            user_id: number | null;
            status: string | null;
            address: string | null;
            phiShip: number | null;
            order_id: number;
            totalAmount: number | null;
            thoiGian: string | null;
            createdAt: Date | null;
        };
    }>;
}
