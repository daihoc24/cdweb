import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { orderService } from "../../../services/order";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Table, { ColumnsType, TableProps } from "antd/es/table";
import { Input } from "antd";
import { Order } from "../../../interfaces/order";
const { Search } = Input;

const Orders: React.FC = () => {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();

  const [ordersList, setOrdersList] = useState<Order[]>([]);
  console.log(ordersList);

  useEffect(() => {
    getOrdersListApi();
  }, []);
  const getOrdersListApi = async () => {
    try {
      const result = await orderService.getListOrder();
      setOrdersList(result.data.content);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchDelete = async (id: any) => {
    try {
      const result = await orderService.deleteOrder(Number(id));
      alert("Xoá thành công!");
      dispatch(getOrdersListApi());
    } catch (errors: any) {
      console.log("errors", errors.response?.data);
    }
  };
  const columns: ColumnsType<Order> = [
    {
      title: "ID",
      dataIndex: "order_id",
      width: 50,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 75,
    },
    {
      title: "Phí ship",
      dataIndex: "phiShip",
      width: 50,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      width: 75,
    },
    {
      title: "Thời gian",
      dataIndex: "thoiGian",
      width: 80,
    },
    {
      title: "Tên người dùng",
      dataIndex: "User",
      render: (User: { user_fullname: string }) => User?.user_fullname, // Truy xuất user_fullname từ đối tượng User
      width: 120,
    },
    {
      title: "Số điện thoại",
      dataIndex: "User",
      render: (User: { user_phone: string }) => User?.user_phone,
      width: 100,
    },
    {
      title: "Sản phẩm",
      dataIndex: "OrderProduct", // Mảng OrderProduct chứa các sản phẩm
      render: (
        OrderProduct: Array<{
          quantity: number;
          Product: {
            products_name: string;
            products_price: number;
          };
        }>
      ) => (
        <div>
          {OrderProduct.map((item, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <div>
                {item.Product.products_name} x {item.quantity}
              </div>
              <div>Giá: {item.Product.products_price.toLocaleString()} VND</div>
            </div>
          ))}
        </div>
      ),
      width: 350,
    },
    {
      title: "Address",
      dataIndex: "address",
      width: 150,
    },
    {
      title: "Hành động",
      dataIndex: "id",
      render: (text, order) => {
        return (
          <Fragment>
            <NavLink
              key={1}
              to={`/admin/updateOrder/${order.order_id}`}
              style={{ marginRight: "20px", fontSize: "30px", color: "blue" }}
            >
              <EditOutlined />
            </NavLink>
            <span
              key={2}
              style={{
                marginRight: "20px",
                fontSize: "30px",
                color: "red",
                cursor: "pointer",
              }}
              onClick={() => {
                if (
                  window.confirm("Bạn có chắc muốn xóa đơn hàng này không?")
                ) {
                  fetchDelete(order.order_id);
                }
              }}
            >
              <DeleteOutlined />
            </span>
          </Fragment>
        );
      },
      width: 200,
    },
  ];
  const data: Order[] = ordersList;
  const onChange: TableProps<Order>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  return (
    <div>
      <h1 style={{ marginBottom: "20px", fontSize: "2rem" }}>
        Quản lí đơn hàng
      </h1>
      {/* <Search
        style={{
          marginBottom: "20px",
          backgroundColor: "#4096ff",
          borderRadius: "5px",
          height: "40px",
        }}
        onSearch={onSearch}
        placeholder="input search text"
        enterButton="Search"
        size="large"
      /> */}
      <Table columns={columns} dataSource={data} onChange={onChange} />
    </div>
  );
};

export default Orders;
