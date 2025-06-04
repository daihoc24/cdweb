// CartPopUp.tsx
import React from 'react';
import { Drawer, List, Avatar, InputNumber, Divider, Button } from 'antd';
import { NavLink } from "react-router-dom";
import { useCart } from '../ProductDetail/CartContext';


interface CartProps {
  visible: boolean;
  onClose: () => void;
}

const CartPopUp: React.FC<CartProps> = ({ visible, onClose }) => {
  const { products, updateProductQuantity, removeProduct } = useCart();

  const total = products.reduce((sum, product) => {
    return sum + product.price * product.quantity;
  }, 0);

  return (
    <Drawer
      title="Giỏ hàng"
      placement="right"
      onClose={onClose}
      visible={visible}
      style={{width:500}}
      width="500px"
    >
      <List
        itemLayout="horizontal"
        dataSource={products}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button type="text" danger onClick={() => removeProduct(item.id)}>Xóa</Button>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.image} />}
              title={item.name}
              description={`Price: ${item.price}đ`}
            />

            <InputNumber
              min={1}
              value={item.quantity}
              onChange={(value) => updateProductQuantity(item.id, Number(value))}
            />
            <div style={{ marginLeft: 16 }}>
              {item.price * item.quantity}đ
            </div>
          </List.Item>
        )}
      />
            <Divider />
            <div style={{ textAlign: 'right', fontWeight: 'bold', marginTop: 550}}>
                Tổng tiền: {total}đ
            </div>
            <Button type="primary" block style={{ marginTop: 20}}>
                <NavLink className="checkout" to="/carts">
                    Thanh toán
                </NavLink>
            </Button>
        </Drawer>
    );
};

export default CartPopUp;
