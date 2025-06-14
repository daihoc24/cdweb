import { useEffect, useState } from "react";
import "./OrderHistory.scss"; // Đảm bảo bạn có file CSS tương ứng
import { useOrderLogic } from "../order/OrderLogic";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { orderService } from "../../services/order";

const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const navigate = useNavigate();
  const { formatPrice } = useOrderLogic(); // Sử dụng hook để định dạng giá

  useEffect(() => {
    const user = localStorage.getItem("USER_INFO");

    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const decoded: any = jwtDecode(user);
      const userId = decoded?.data?.id;

      if (!userId) {
        console.error("User ID không tồn tại.");
        return;
      }

      const fetchOrders = async () => {
        try {
          const response = await orderService.getListOrderByUserID(userId);

          if (response.status === 200) {
            const data = response.data.content;
            console.log(data);

            data.sort(
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );

            setOrders(data);
          } else {
            throw new Error("Failed to fetch orders");
          }
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        }
      };

      fetchOrders();
    } catch (error) {
      console.error("Invalid token:", error);
      navigate("/login");
    }
  }, [navigate]);

  const handleViewDetails = (orderId: number) => {
    navigate(`/orderDetail/${orderId}`);
  };
  const handleBankPayment = (orderId: number) => {
    navigate(`/payment/${orderId}`);
  };

  if (orders.length === 0) {
    return <div>Không có đơn hàng nào.</div>; // Hiển thị thông báo nếu không có đơn hàng
  }

  return (
    <div className="orderHistoryContainer">
      <h2
        style={{ textAlign: "center", color: "#006600", marginBottom: "50px" }}
      >
        Lịch sử đơn hàng
      </h2>
      <table className="orderTable">
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Trạng thái</th>
            <th>Phí vận chuyển</th>
            <th>Thời gian</th>
            <th>Tổng tiền</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any, index: number) => (
            <tr key={index}>
              <td>
                {Array.isArray(order.OrderProduct) &&
                order.OrderProduct.length > 0 ? (
                  <img
                    src={order.OrderProduct[0].Product.products_image}
                    alt={order.OrderProduct[0].Product.products_name}
                    className="productImage"
                  />
                ) : (
                  <span>No Image</span>
                )}
              </td>
              <td>{order.status}</td>
              <td>{formatPrice(order.phiShip)}</td>
              <td>{order.thoiGian}</td>
              <td>{formatPrice(order.totalAmount)}</td>
              <td>
                <button
                  className="button"
                  style={{
                    background: "green",
                    width: "140px",
                    padding: "10px",
                    borderRadius: "10px",
                    color: "white",
                  }}
                  onClick={() => handleViewDetails(order.order_id)}
                >
                  Xem chi tiết
                </button>
                <button
                  className="button"
                  style={{
                    background: "green",
                    width: "200px",
                    padding: "10px",
                    borderRadius: "10px",
                    color: "white",
                    marginLeft: "20px",
                  }}
                  onClick={() => handleBankPayment(order.order_id)}
                >
                  Thanh toán ngân hàng
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistoryPage;
export {}
