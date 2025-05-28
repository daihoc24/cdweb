import React, { useEffect, useState } from "react";
import { Button } from "antd";
import data from "../../data.json";
import "./Home.scss";
import { Link } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { CiMenuBurger } from "react-icons/ci";
import { listProduct } from "../../interfaces/product";
import { productService } from "../../services/product";

// Định nghĩa kiểu dữ liệu cho sản phẩm

const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
};

const Home: React.FC = () => {
    const [products, setProducts] = useState<listProduct[]>([]);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await productService.fetchProductApi();
                console.log(result.data.content);
                setProducts(result.data.content);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);
    const groupByType = () => {
        const groupedProducts: { [key: string]: listProduct[] } = {};
        products.forEach((product) => {
            if (!groupedProducts[product.products_type]) {
                groupedProducts[product.products_type] = [];
            }
            groupedProducts[product.products_type].push(product);
        });
        return groupedProducts;
    };

    const groupedProducts = groupByType();

    return (
        <div>
            <section style={{ backgroundColor: "white", display: "flex" }}>
                <div
                    className="home_container"
                    style={{ width: "75%", paddingLeft: 50 }}
                >
                    <Carousel style={{ paddingTop: 100 }}>
                        <Carousel.Item>
                            <img
                                className="d-block banner_home"
                                src="/img/home_bannerslider_1_picture.webp"
                                alt="First slide"
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block banner_home"
                                src="/img/home_bannerslider_2_picture.webp"
                                alt="Second slide"
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block banner_home"
                                src="/img/home_bannerslider_3_picture.jpg"
                                alt="Third slide"
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block banner_home"
                                src="/img/home_bannerslider_4_picture.webp"
                                alt="Third slide"
                            />
                        </Carousel.Item>
                    </Carousel>
                    <h1 style={{ paddingTop: 40, paddingBottom: 40 }}>Thực đơn</h1>
                    <div
                        className="flex items-center"
                        style={{ background: "rgb(135 200 74 / 64%)", height: 60 }}
                    >
                        <img
                            src="/img/logo-icon1.webp"
                            alt=""
                            style={{ paddingRight: 20, width: "10%" }}
                        />
                        <img
                            src="/img/logo-icon2.webp"
                            alt=""
                            style={{ paddingRight: 20, width: "7%" }}
                        />
                    </div>

                    {/* Hiển thị từng nhóm sản phẩm */}
                    {Object.keys(groupedProducts).map((type) => (
                        <div key={type}>
                            <div
                                className="heading_list"
                                style={{
                                    paddingTop: 20,
                                    paddingBottom: 20,
                                    fontSize: 28,
                                    fontWeight: 500,
                                }}
                            >
                                <a id={`link-${type}`}>
                                    {type} {/* Hiển thị tên loại sản phẩm */}
                                </a>
                            </div>
                            <div className="row">
                                {/* Hiển thị sản phẩm trong từng nhóm */}
                                {groupedProducts[type].map((product) => (
                                    <div
                                        key={product.products_id}
                                        style={{ height: 490, paddingBottom: 20 }}
                                        className="col-xl-3 col-md-4 col-sm-6"
                                    >
                                        <div className="card" style={{ height: "100%" }}>
                                            <img
                                                src={product.products_image}
                                                className="card-img-top"
                                                alt={product.products_name}
                                            />
                                            <div className="card-body">
                                                <div style={{ height: 100 }}>
                                                    <h5
                                                        className="mb-0"
                                                        style={{
                                                            fontSize: 16,
                                                            fontWeight: 400,
                                                            paddingBottom: 10,
                                                        }}
                                                    >
                                                        {product.products_name}
                                                    </h5>
                                                    <h5
                                                        className="text-dark mb-0"
                                                        style={{ fontSize: 16, fontWeight: 600 }}
                                                    >
                                                        {formatPrice(product.products_price)}
                                                    </h5>
                                                </div>
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <Link to={`/product-detail/${product.products_id}`}>
                                                        <Button className="detail">Xem chi tiết</Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div
                    className="box"
                    style={{
                        paddingTop: 80,
                        width: "20%",
                        paddingLeft: 10,
                        position: "fixed",
                        right: "5%",
                    }}
                >
                    <div className="box_item">
                        <div
                            style={{
                                background: "#87c84a",
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5,
                            }}
                        >
                            <div className="flex items-center" style={{ padding: 10 }}>
                                <CiMenuBurger style={{ fontSize: 30, marginRight: 10 }} />
                                <h2 className="title" style={{ margin: 0, fontSize: 30 }}>
                                    Danh mục
                                </h2>
                            </div>
                        </div>
                        <ul style={{ padding: 0, marginBottom: 0 }}>
                            <li className="home_type">
                                <a href={`#link-Combo`}>Combo</a>
                            </li>
                            <li className="home_type">
                                <a href={`#link-Cơm`}>Cơm</a>
                            </li>
                            <li className="home_type">
                                <a href={`#link-Mì`}>Mì</a>
                            </li>
                            <li className="home_type">
                                <a href={`#link-Miến`}>Miến</a>
                            </li>
                            <li className="home_type">
                                <a href={`#link-Phá lấu`}>Phá lấu</a>
                            </li>
                            <li className="home_type">
                                <a href={`#link-Nước giải khát`}>Nước giải khát</a>
                            </li>
                            <li className="home_type">
                                <a href={`#link-Các món khác`}>Các món khác</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
