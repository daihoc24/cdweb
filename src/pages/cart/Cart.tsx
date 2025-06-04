import React, { useEffect, useState } from 'react';
import {List, Avatar, InputNumber, Button, message, Select} from 'antd';
import { useCart } from '../ProductDetail/CartContext';
import { Link } from 'react-router-dom';
import "./cart.scss";

const { Option } = Select;

const Cart: React.FC = () => {
    const { products, getTotalPrice, removeProduct, updateProductQuantity } = useCart();
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const [isInfoVisible, setIsInfoVisible] = useState<boolean>(false);

    const handlePaymentButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (products.length === 0) {
            message.error('Chưa có sản phẩm nào trong giỏ hàng!');
            e.preventDefault();
        } else {
            setIsInfoVisible(true);
        }
    };

    useEffect(() => {
        const adjustMessageZIndex = () => {
            const messageContainer = document.querySelector('.ant-message') as HTMLElement;
            if (messageContainer) {
                messageContainer.style.zIndex = '100001';
                messageContainer.style.position = 'fixed';
            }
        };

        message.config({
            top: 100, // Điều chỉnh vị trí top của thông báo
            getContainer: () => {
                adjustMessageZIndex();
                return document.body;
            },
        });
    }, []);

    return (
        <div className="main">
            <List
                className="orderContainer"
                itemLayout="horizontal"
                dataSource={products}
                renderItem={(product) => (
                    <List.Item
                        actions={[
                            <Button style={{ marginLeft: "150px" }} type="text" danger onClick={() => removeProduct(product.id)}>Xóa</Button>
                        ]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={product.image} />}
                            title={product.name}
                            description={`Giá: ${formatPrice(product.price)}`}
                        />
                        <InputNumber
                            style={{ marginRight: "100px" }}
                            min={1}
                            value={product.quantity}
                            onChange={(value) => updateProductQuantity(product.id, value as number)}
                        />
                        <div>
                            {formatPrice(product.price * product.quantity)}
                        </div>
                    </List.Item>
                )}
            />
            <div className="checkOut">
                <div className="title">
                    <h3>Thanh toán</h3>
                </div>
                <div className="sumAmount">
                    <label className="card-title">Tổng tiền:</label>
                    <InputNumber className="sumAmounts" value={formatPrice(getTotalPrice())} readOnly />
                </div>
                <div className="lines"></div>
                <div className="button">
                    <Link to={"/order"}>
                        <Button className="buttons" onClick={handlePaymentButtonClick}>Thanh toán</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
