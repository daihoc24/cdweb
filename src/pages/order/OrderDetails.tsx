import { useEffect, useState } from "react";
import "./OrderDteails.scss";
import { Link, useParams } from "react-router-dom";
import { useOrderLogic } from "./OrderLogic";
import { orderService } from "../../services/order";
import { userService } from "../../services/user";

const OrderDetails: React.FC = () => {
  const { orderId } = useParams();
  const { formatPrice } = useOrderLogic();
  const [orderData, setOrderData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      // Gọi API để lấy thông tin chi tiết đơn hàng bằng orderId
      const fetchOrderDetails = async () => {
        try {
          const response = await orderService.getOrderById(Number(orderId)); // Gọi API lấy thông tin đơn hàng
          if (response.status === 200) {
            setOrderData(response.data.content);
            console.log(orderData);
          } else {
            console.error("Failed to fetch order details");
          }
        } catch (error) {
          console.error("Error fetching order details:", error);
        }
      };

      fetchOrderDetails();
    }
  }, [orderId]); // Khi orderId thay đổi thì gọi lại API

  useEffect(() => {
    if (orderData?.user_id) {
      // Gọi API lấy thông tin người dùng từ user_id
      const fetchUserDetails = async () => {
        try {
          const response = await userService.getUserById(orderData.user_id); // Gọi API getUserById
          if (response.status === 200) {
            setUserData(response.data.content);
            console.log(userData);
          } else {
            console.error("Failed to fetch user details");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      fetchUserDetails();
    }
  }, [orderData]);

  if (!orderData || !userData) {
    return <div>Loading...</div>; // Chờ dữ liệu đơn hàng và người dùng
  }

  return (
    <div className="orderDetailContainer">
      <div className="order-details">
        <Link to="/order-history">
          <button className="back">X</button>
        </Link>
        <h3 className="info" style={{ textAlign: "center" }}>
          Thông tin đơn hàng
        </h3>

        <div className="order-detail-section">
          <span className="detail-title">Sản phẩm:</span>
          <ul style={{ paddingLeft: 0 }}>
            {orderData.OrderProduct.map((orderProduct: any, index: number) => (
              <li key={index}>
                {orderProduct.Product.products_name}: {orderProduct.quantity} x{" "}
                {formatPrice(orderProduct.Product.products_price)}
              </li>
            ))}
          </ul>
        </div>

        <div className="order-detail-section">
          <span className="detail-title">Trạng thái:</span>
          <span className="detail-info">{orderData.status}</span>
        </div>
        <div className="order-detail-section">
          <span className="detail-title">Phí vận chuyển:</span>
          <span className="detail-info">{formatPrice(orderData.phiShip)}</span>
        </div>

        <div className="order-detail-section">
          <span className="detail-title">Tổng tiền:</span>
          <span className="detail-info">
            {formatPrice(orderData.totalAmount + orderData.phiShip)}
          </span>
        </div>
        <div className="order-detail-section">
          <span className="detail-title">Thời gian dự kiến nhận hàng:</span>
          <span className="detail-info">{orderData.thoiGian}</span>
        </div>
        <div className="order-detail-section">
          <span className="detail-title">Địa chỉ nhận hàng:</span>
          <span className="detail-info">{orderData.address}</span>
        </div>
        <div className="order-detail-section">
          <span className="detail-title">Số điện thoại:</span>
          <span className="detail-info">{userData.user_phone}</span>
        </div>
        <div className="order-detail-section">
          <span className="detail-title">Tên:</span>
          <span className="detail-info">{userData.user_fullname}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
