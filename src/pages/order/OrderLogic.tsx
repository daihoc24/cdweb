import { useEffect, useState } from "react";
import { message } from "antd";
import { useCart } from "../ProductDetail/CartContext";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../services/order";
import { jwtDecode } from "jwt-decode";
import { OrderData } from "../../interfaces/order";

message.config({
    top: 100,
    duration: 3,
    maxCount: 3,
});
export const useOrderLogic = () => {
    const { products, clearCart, getTotalPrice, sumQuantity } = useCart();
    const selectedDistrict = "TP.Thủ Đức"; // Cố định huyện là Thủ Đức
    const provin = "TP.HCM"; // Cố định huyện là Thủ Đức
    const [shippingInfo, setShippingInfo] = useState<{ phiShip: number }>({
        phiShip: 0,
    });

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const getTotalAmount = (): number => {
        return getTotalPrice();
    };
    const getUserId = (): string | null => {
        const userInfo = localStorage.getItem("USER_INFO");
        console.log(userInfo); // Kiểm tra xem dữ liệu có tồn tại không
        if (!userInfo) {
            return null; // Nếu không có token, trả về null
        }

        try {
            // Giải mã token JWT
            const decoded: any = jwtDecode(userInfo); // Giải mã và ép kiểu `any`
            console.log(decoded); // Kiểm tra xem dữ liệu giải mã có chính xác không

            // Trả về `user.id` nếu tồn tại, nếu không trả về null
            return decoded?.data?.id || null;
        } catch (error) {
            console.error("Lỗi khi giải mã token:", error);
            return null;
        }
    };
    const handleFinish = async (values: OrderData) => {
        const phiShip = getShippingFee(values.phuong);
        const userId = Number(getUserId());
        console.log(userId);

        const fullAddress = `${values.sonha}, ${values.phuong}, ${selectedDistrict}, ${provin}`;
        const orderData = {
            user_id: userId,
            address: fullAddress,
            orderProducts: products.map((product) => ({
                products_id: Number(product.id),
                quantity: product.quantity,
            })),
            phiShip,
        };
        console.log(orderData);

        try {
            // Gọi API để tạo đơn hàng
            await orderService.createOrder(orderData);

            // Lưu thông tin đơn hàng vào localStorage
            //   localStorage.setItem("orderData", JSON.stringify(orderData));

            message.success("Đặt hàng thành công!");
            clearCart();
        } catch (error) {
            message.error("Đặt hàng thất bại!");
        }
    };

    const getShippingFee = (phuong: string): number => {
        const sumQuantityValue = sumQuantity();
        if (sumQuantityValue >= 5) {
            switch (phuong) {
                case "Phường Linh Xuân":
                case "Phường Linh Trung":
                case "Phường Trường Thọ":
                case "Phường Tam Phú":
                case "Phường Tam Bình":
                case "Phường Linh Tây":
                case "Phường Linh Đông":
                case "Phường Hiệp Bình Phước":
                case "Phường Hiệp Bình Chánh":
                case "Phường Bình Thọ":
                case "Phường Bình Chiểu":
                    return 0; // Miễn phí ship khi tổng số lượng >= 5
                default:
                    return 0;
            }
        } else {
            switch (phuong) {
                case "Phường Linh Xuân":
                case "Phường Linh Trung":
                    return 10000;
                case "Phường Trường Thọ":
                case "Phường Tam Bình":
                case "Phường Linh Tây":
                case "Phường Bình Thọ":
                    return 15000;
                case "Phường Tam Phú":
                case "Phường Linh Đông":
                case "Phường Bình Chiểu":
                    return 20000;
                case "Phường Hiệp Bình Phước":
                    return 25000;
                case "Phường Hiệp Bình Chánh":
                    return 20000;
                default:
                    return 0;
            }
        }
    };

    return {
        products,
        selectedDistrict,
        formatPrice,
        getTotalAmount,
        handleFinish,
        getShippingFee,
        shippingInfo,
        setShippingInfo,
    };
};
