import React, { useEffect, useState } from "react";
import { Button, Pagination, Select, Input } from "antd";
import "./Product.scss";
import { Link } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { productService } from "../../services/product";
import { listProduct } from "../../interfaces/product";

// Định nghĩa kiểu dữ liệu cho sản phẩm

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const Product: React.FC = () => {
  const [products, setProducts] = useState<listProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await productService.fetchProductApi();
        console.log(result.data);
        setProducts(result.data.content);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<string | undefined>(
    undefined
  );
  const [searchTerm, setSearchTerm] = useState<string>(""); // State cho thanh tìm kiếm
  const pageSize = 24; // Số sản phẩm mỗi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setCurrentPage(1); // Reset page khi type thay đổi
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value.toLowerCase()); // Chỉ chuyển đổi về chữ thường mà không loại bỏ khoảng trắng
    setCurrentPage(1);
  };
  const filteredProducts = selectedType
    ? products.filter((product) => product.products_type === selectedType)
    : products;

  const searchedProducts = searchTerm
    ? filteredProducts.filter((product) =>
        product.products_name.toLowerCase().includes(searchTerm)
      )
    : filteredProducts;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProducts = searchedProducts.slice(startIndex, endIndex);

  // Lấy danh sách các loại sản phẩm để hiển thị trong select
  const productTypes: string[] = [];
  const typeSet = new Set(products.map((product) => product.products_type));
  typeSet.forEach((type) => {
    productTypes.push(type);
  });

  return (
    <div>
      <section style={{ backgroundColor: "white" }}>
        <div className="banner">
          <img src="/img/image.png" alt="" />
        </div>
        <div className="container">
          <div className="heading_list">
            <h1
              style={{
                textAlign: "center",
                padding: 30,
                fontSize: 36,
                fontWeight: 500,
              }}
            >
              Thực đơn
            </h1>
          </div>
          <div className="flex justify-between items-center">
            {/* Dropdown select để chọn type */}
            <div style={{ marginBottom: 20 }}>
              <Select
                value={selectedType}
                onChange={handleTypeChange}
                style={{ width: 200 }}
                placeholder="Chọn loại sản phẩm"
              >
                <Select.Option value={undefined}>Tất cả</Select.Option>
                {productTypes.map((type, index) => (
                  <Select.Option key={index} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </div>
            {/* Thanh tìm kiếm */}
            <div style={{ marginBottom: 20 }}>
              <Input.Search
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Tìm kiếm theo tên món ăn"
                style={{ width: 500 }}
                size="large"
                className="search-input"
              />
            </div>
          </div>
          <div className="row">
            {currentProducts.map((product) => (
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
          <Pagination
            current={currentPage}
            total={searchedProducts.length}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
            style={{
              padding: 20,
            }}
            className="col-12 justify-center flex"
          />
        </div>
      </section>
    </div>
  );
};

export default Product;

