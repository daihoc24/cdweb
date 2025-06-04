import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Prisma, PrismaClient } from '@prisma/client';
export declare class OrderService {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
    private driverLatitude;
    private driverLongitude;
    simulateTravelTime(latitude: number, longitude: number): Promise<string>;
    private moveDriverTowardsDestination;
    private startSimulatedDriverMovement;
    private updateOrderTime;
    private updateOrderStatus;
    getListOrder(): Promise<{
        data: ({
            User: {
                user_fullname: string | null;
                user_phone: string | null;
            } | null;
            OrderProduct: {
                Product: {
                    products_name: string | null;
                    products_price: number | null;
                    products_id: number;
                    products_image: string | null;
                } | null;
                quantity: number | null;
            }[];
        } & {
            user_id: number | null;
            status: string | null;
            address: string | null;
            phiShip: number | null;
            order_id: number;
            totalAmount: number | null;
            thoiGian: string | null;
            createdAt: Date | null;
        })[];
    }>;
    getListOrderByUserID(userId: number): Promise<{
        data: ({
            User: {
                user_fullname: string | null;
                user_phone: string | null;
            } | null;
            OrderProduct: {
                Product: {
                    products_name: string | null;
                    products_price: number | null;
                    products_image: string | null;
                } | null;
                quantity: number | null;
            }[];
        } & {
            user_id: number | null;
            status: string | null;
            address: string | null;
            phiShip: number | null;
            order_id: number;
            totalAmount: number | null;
            thoiGian: string | null;
            createdAt: Date | null;
        })[];
    }>;
    getOrderById(orderId: number): Promise<{
        data: {
            User: {
                user_fullname: string | null;
                user_phone: string | null;
            } | null;
            OrderProduct: {
                Product: {
                    products_name: string | null;
                    products_price: number | null;
                    products_id: number;
                    products_image: string | null;
                } | null;
                quantity: number | null;
            }[];
        } & {
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
    createOrder(body: CreateOrderDto): Promise<{
        user_id: number | null;
        status: string | null;
        address: string | null;
        phiShip: number | null;
        order_id: number;
        totalAmount: number | null;
        thoiGian: string | null;
        createdAt: Date | null;
    }>;
    updateOrder(id: number, body: UpdateOrderDto): Promise<{
        user_id: number | null;
        status: string | null;
        address: string | null;
        phiShip: number | null;
        order_id: number;
        totalAmount: number | null;
        thoiGian: string | null;
        createdAt: Date | null;
    }>;
    deleteOrder(id: number): Promise<{
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
    getCoordinates(address: string): Promise<{
        latitude: number;
        longitude: number;
    }>;
    getTravelTime(startLat: number, startLon: number, endLat: number, endLon: number): Promise<string>;
}
