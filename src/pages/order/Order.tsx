import React, { useState, useEffect } from "react";
import { List, Avatar, InputNumber, Button, Form, Select, Input } from "antd";
import { useOrderLogic } from "./OrderLogic";
import "./Order.scss";
import OrderDetails from "./OrderDetails"; // Đảm bảo đường dẫn import đúng cho OrderDetails
import { useNavigate } from "react-router-dom";

const Order: React.FC = () => {
  const {
    products,
    selectedDistrict,
    formatPrice,
    handleFinish,
    getShippingFee,
    shippingInfo,
    setShippingInfo,
    getTotalAmount,
  } = useOrderLogic();

  const [selectedWard, setSelectedWard] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedWard) {
      const phiShip = getShippingFee(selectedWard);
      setShippingInfo({ phiShip });
    }
  }, [selectedWard, getShippingFee, setShippingInfo]);

  const onFinish = (values: any) => {
    handleFinish(values);
    setTimeout(() => {
      navigate("/order-history");
    }, 2000);
  };

  const handleWardChange = (value: string) => {
    setSelectedWard(value);
  };

  return (
    <div className="large-font">
      <List
        className="orderContainer"
        itemLayout="horizontal"
        dataSource={products}
        renderItem={(product) => (
          <List.Item key={product.id}>
            <List.Item.Meta
              avatar={<Avatar src={product.image} />}
              title={product.name}
              description={`Giá: ${formatPrice(product.price)}`}
            />
            <InputNumber min={1} value={product.quantity} />
            <div style={{ marginLeft: "300px" }}>
              {formatPrice(product.price * product.quantity)}
            </div>
          </List.Item>
        )}
      />
      <div className="s">
        <div className="infomation">
          <div className="titelOrder">
            <h3>Nhập thông tin nhận hàng</h3>
          </div>
          <Form layout="vertical" onFinish={onFinish}>
            <div className="form">
              <Form.Item name="tinh" label="Tỉnh" initialValue="TP.HCM">
                <Input disabled value={"TP.HCM"} />
              </Form.Item>
              <Form.Item name="huyen" label="Huyện" initialValue="TP.Thủ Đức">
                <Input disabled value={selectedDistrict} />
              </Form.Item>
              <Form.Item
                name="phuong"
                label="Phường"
                rules={[{ required: true, message: "Vui lòng chọn phường!" }]}
              >
                <Select onChange={handleWardChange}>
                  <Select.Option value={"Phường Linh Xuân"}>
                    Phường Linh Xuân
                  </Select.Option>
                  <Select.Option value={"Phường Linh Trung"}>
                    Phường Linh Trung
                  </Select.Option>
                  <Select.Option value={"Phường Trường Thọ"}>
                    Phường Trường Thọ
                  </Select.Option>
                  <Select.Option value={"Phường Tam Phú"}>
                    Phường Tam Phú
                  </Select.Option>
                  <Select.Option value={"Phường Tam Bình"}>
                    Phường Tam Bình
                  </Select.Option>
                  <Select.Option value={"Phường Linh Tây"}>
                    Phường Linh Tây
                  </Select.Option>
                  <Select.Option value={"Phường Linh Đông"}>
                    Phường Linh Đông
                  </Select.Option>
                  <Select.Option value={"Phường Hiệp Bình Phước"}>
                    Phường Hiệp Bình Phước
                  </Select.Option>
                  <Select.Option value={"Phường Hiệp Bình Chánh"}>
                    Phường Hiệp Bình Chánh
                  </Select.Option>
                  <Select.Option value={"Phường Bình Thọ"}>
                    Phường Bình Thọ
                  </Select.Option>
                  <Select.Option value={"Phường Bình Chiểu"}>
                    Phường Bình Chiểu
                  </Select.Option>
                </Select>
              </Form.Item>
            </div>
            <Form.Item
              name="sonha"
              label="Số nhà"
              rules={[{ required: true, message: "Vui lòng nhập số nhà!" }]}
            >
              <Input />
            </Form.Item>
            <p style={{ fontSize: "17px" }}>
              Phí vận chuyển: {formatPrice(shippingInfo.phiShip)}
            </p>
            <p style={{ fontSize: "17px" }}>
              {" "}
              Tổng tiền: {formatPrice(shippingInfo.phiShip + getTotalAmount())}
            </p>
            <Form.Item style={{ marginTop: "50px" }}>
              <div style={{ display: "flex" }}>
                <Button className="submit" type="primary" htmlType="submit">
                  Xác nhận đơn hàng
                </Button>
              </div>
            </Form.Item>
          </Form>
          {/*<div style={{ position: "absolute", marginLeft: "-1300px", marginTop: "-535px" }}>*/}
          {/*    {showOrderDetails && <OrderDetails />}*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  );
};

export default Order;
