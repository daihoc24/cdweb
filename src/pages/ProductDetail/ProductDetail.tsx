import { Link, useParams } from "react-router-dom";
import { ChangeEvent, useEffect, useState } from "react";
import "./ProductDetail.scss";
import { FaHome, FaRegUserCircle, FaStar } from "react-icons/fa";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import { TbTruckDelivery } from "react-icons/tb";
import { MdOutlinePayment } from "react-icons/md";
import { FaHandHoldingUsd } from "react-icons/fa";
import { FaGift } from "react-icons/fa6";
import { Avatar, Form, Button, List, Input, message, Spin } from "antd";
import moment from "moment";

import { useCart } from "./CartContext";
import { addComment, Comment, listProduct } from "../../interfaces/product";
import { HeartOutlined, UndoOutlined, UserOutlined } from "@ant-design/icons";
import { productService } from "../../services/product";
import { jwtDecode } from "jwt-decode";
import { userService } from "../../services/user";

export default function ProductDetail() {
  const [data, setData] = useState<listProduct | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [others, setOthers] = useState<listProduct[]>([]);
  const [newCommentText, setNewCommentText] = useState<string>("");
  const [initialized, setInitialized] = useState(false);
  const [amount, setAmount] = useState<number>(1);
  const [isPopupVisible, setPopupVisible] = useState<boolean>(false);
  const [likedComments, setLikedComments] = useState<{
    [key: number]: boolean;
  }>({});
  const { addToCart } = useCart();
  const { productId } = useParams<{ productId: string }>();
  const [loadingOthers, setLoadingOthers] = useState<boolean>(true);
  const [loadingProduct, setLoadingProduct] = useState<boolean>(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [author, setAuthor] = useState<string>("Unknown");
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  const storedUser = localStorage.getItem("USER_INFO") || "{}";
  let userId: number;
  try {
    // Kiểm tra xem token có hợp lệ không trước khi giải mã
    const decoded: any = jwtDecode(storedUser);
    userId = decoded?.data?.id;
  } catch (error) {
    console.error("Token không hợp lệ:", error);
  }
  useEffect(() => {
    if (userId) {
      const userInfor = async () => {
        try {
          const response = await userService.getUserById(userId);
          setAuthor(response.data.content.user_fullname);
        } catch (error) {
          console.error("Failed to fetch comments:", error);
        }
      };
      userInfor();
    }
  }, [productId]);
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoadingProduct(true);
        const result = await productService.fetchProductDetailApi(
          Number(productId)
        );
        setData(result.data.content);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoadingProduct(false);
      }
    };

    const fetchAllProducts = async () => {
      try {
        setLoadingOthers(true);
        const result = await productService.fetchProductApi(); // Adjust this method
        const allProducts = result.data.content;
        const otherProducts = allProducts.filter(
          (product) => product.products_id !== Number(productId)
        );
        setOthers(otherProducts.slice(0, 5)); // Show only 5 other products
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoadingOthers(false);
      }
    };

    fetchProductDetail();
    fetchAllProducts();
  }, [productId]);

  const handleAddToCart = () => {
    if (data) {
      const productToAdd = {
        id: data.products_id.toString(),
        name: data.products_name,
        price: data.products_price,
        quantity: amount,
        image: data.products_image,
      };
      addToCart(productToAdd);
      message.success("Thêm sản phẩm vào giỏ hàng thành công");
    }
  };

  const handleBuyNow = () => {
    if (data) {
      const productToAdd = {
        id: data.products_id.toString(),
        name: data.products_name,
        price: data.products_price,
        quantity: amount,
        image: data.products_image,
      };
      addToCart(productToAdd);
      window.location.href = `/order`;
    }
  };
  useEffect(() => {
    const fetchComment = async () => {
      if (productId) {
        try {
          const response = await productService.getListCommentByProductId(
            Number(productId)
          );
          setComments(response.data.content);
        } catch (error) {
          console.error("Failed to fetch comments:", error);
        }
      }
    };

    fetchComment();
  }, [productId, comments]);

  useEffect(() => {
    const initialLikedComments: { [key: number]: boolean } = {};
    comments.forEach((comment) => {
      initialLikedComments[comment.id] = false; // Mặc định chưa thích
    });
    setLikedComments(initialLikedComments);
  }, [comments]);
  const handleAddComment = async () => {
    if (newCommentText.trim() === "") return;

    const newComment: addComment = {
      user_id: userId, // user_id từ localStorage
      user_fullname: author, // Tên người bình luận (author)
      content: newCommentText, // Nội dung bình luận
    };

    try {
      const response = await productService.addComment(
        Number(productId),
        newComment
      );
      setTimeout(() => {
        setComments((prevComments) => [...prevComments, response.data.content]);
        setNewCommentText("");
      }, 500);
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewCommentText(e.target.value);
  };

  const handleLikeClick = (commentId: number) => {
    setLikedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleRevokeClick = async (commentId: number) => {
    try {
      const response = await productService.deleteCommentById(
        Number(commentId),
        userId
      );
      if (response.status === 200) {
        const updatedComments = await productService.getListCommentByProductId(
          Number(productId)
        );
        setComments(updatedComments.data.content);
      } else {
        console.error("Failed to revoke comment:", response.data.message);
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };
  useEffect(() => {
    console.log("Updated comments state:", comments);
  }, [comments]);
  const handleProductClick = (productId: number) => {
    window.location.href = `/product-detail/${productId}`;
  };
  const renderOthers = (others: listProduct[]) => {
    return others.map((element) => (
      <div key={element.products_id} className="px-5 py-5 mx-3 others">
        <div
          onClick={() => handleProductClick(element.products_id)}
          style={{ cursor: "pointer" }}
        >
          <div>
            <img
              src={element.products_image}
              alt={element.products_name}
              className="w-full h-auto"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-color1 py-2">
              {element.products_name}
            </h3>
            <p className="py-1 font-semibold">
              {formatPrice(element.products_price)}
            </p>
          </div>
        </div>
      </div>
    ));
  };

  const renderComments = (comments: Comment[]) => (
    <ul className="px-20">
      {comments.map((comment) => (
        <li
          key={comment.comment_id}
          style={{
            marginBottom: 20,
            padding: 10,
            borderRadius: "5px",
            background: "#fff",
          }}
        >
          <div className="flex items-center mb-3">
            <UserOutlined
              style={{
                fontWeight: 400,
                marginRight: 20,
                marginLeft: 20,
                fontSize: 30,
                padding: 3,
                border: "2px solid",
                borderRadius: "50%",
                color: "#0000009e",
              }}
            />
            <div>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  marginBottom: 0,
                  color: "#385898",
                }}
              >
                {comment.user_fullname}
              </p>
              <p style={{ fontSize: 12, color: "#999", marginBottom: 0 }}>
                {moment(comment.created_at).fromNow()}
              </p>
            </div>
          </div>
          <div className="line_1" style={{ marginBottom: 10 }}></div>
          <p style={{ marginBottom: 30, fontSize: 20, marginLeft: 20 }}>
            {comment.content}
          </p>
          <div className="line_1" style={{ marginBottom: 10 }}></div>
          <div className="flex items-center mx-3 py-2">
            <div
              className="flex items-center mr-4"
              style={{ cursor: "pointer" }}
              onClick={() => handleLikeClick(comment.comment_id)}
            >
              <HeartOutlined
                style={{
                  color: likedComments[comment.comment_id] ? "red" : "inherit",
                }}
              />
              <span
                style={{
                  marginLeft: 5,
                  color: likedComments[comment.comment_id] ? "red" : "inherit",
                }}
              >
                Thích
              </span>
            </div>
            {comment.user_id === userId && (
              <div
                className="flex items-center ml-4"
                style={{ cursor: "pointer" }}
                onClick={() => handleRevokeClick(comment.comment_id)}
              >
                <UndoOutlined />
                <span style={{ marginLeft: 5 }}>Thu hồi</span>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );

  if (loadingProduct || loadingOthers) {
    return <Spin tip="Đang tải dữ liệu..." />;
  }

  if (!data) {
    return <div>Không tìm thấy sản phẩm.</div>;
  }
  return (
    <div style={{ paddingTop: 80 }}>
      <div>
        <div className="path flex items-center">
          <span className="mx-2">
            <FaHome />
          </span>
          <span style={{ fontWeight: 400 }}>Home / Shop / Detail</span>
        </div>

        <div className="px-10 py-5">
          <div
            className="detail_container mx-auto py-10 product-details flex justify-center	"
            style={{ width: 1280, background: "#fff" }}
          >
            <div className="product_img">
              <img
                src={data.products_image}
                style={{ width: 500, height: 530 }}
              />
              <div className="flex flex-wrap justify-center items-center py-10">
                <button className="px-2 py-1 flex justify-center items-center font-semibold text-sm text-gray-700">
                  <ShareIcon />
                  <span className="ml-2">Chia sẻ</span>
                </button>
                <button className="px-2 py-1 flex justify-center items-center font-semibold text-sm text-gray-700">
                  <FavoriteBorderIcon />
                  <span className="ml-2">Yêu thích</span>
                </button>
              </div>
            </div>
            <div>
              <p className="mb-2">
                <button className="mr-3"></button>
                <span className="font-semibold text-xl sm:text-3xl tracking-widest leading-relaxed text-gray-900">
                  {data.products_name}
                </span>
              </p>

              {/*<div>*/}
              {/*  <p className="text-base font-normal tracking-widest mx-2">*/}
              {/*    Mã sản phẩm: {detail.id}*/}
              {/*  </p>*/}
              {/*</div>*/}
              <div className="py-3">
                <span className="text-lg font-semibold tracking-widest mx-2 product_price">
                  {formatPrice(data.products_price)}
                </span>
              </div>
              <div
                className="my-3"
                style={{ padding: 10, background: "#f8f8f8", borderRadius: 10 }}
              >
                <div
                  style={{
                    background: "#f33828",
                    borderRadius: 5,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FaGift style={{ color: "#fff", marginLeft: 10 }} />
                  {/* <p
                    style={{
                      background: "#f33828",
                      width: "70%",
                      borderRadius: 5,
                      display: "flex",
                      alignItems: "center",
                    }}
                > */}
                  <FaGift style={{ color: "#fff", marginLeft: 10 }} />
                  <p
                    style={{
                      padding: "5px 10px",
                      color: "#fff",
                      fontWeight: 500,
                      margin: 0,
                    }}
                  >
                    Thân chúc quý khách dùng ngon miệng
                  </p>
                </div>

                <ul
                  className="promotion_box"
                  style={{
                    padding: 10,
                    background: "#fff",
                    marginTop: 10,
                    listStyleType: "disc",
                  }}
                >
                  <li>Freeship với đơn hàng 5 phần trở lên</li>
                  <li>Tặng kèm trái cây tráng miệng mỗi ngày</li>
                  <li>Cuối tuần tặng kèm nước uống</li>
                </ul>
              </div>
              <div className="flex items-center pt-3">
                <div className="flex" style={{ marginRight: 20 }}>
                  <button
                    className="decrease"
                    onClick={() =>
                      setAmount((prev) => (prev > 1 ? prev - 1 : prev))
                    }
                  >
                    -
                  </button>
                  <span className="amount">{amount}</span>
                  <button
                    className="increase"
                    onClick={() => setAmount((prev) => prev + 1)}
                  >
                    +
                  </button>
                </div>
                <div>
                  <button className="addToCart" onClick={handleAddToCart}>
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
              <div onClick={handleBuyNow}>
                <button className="buyNow">Mua ngay</button>
              </div>

              <p
                className="text-center"
                style={{ padding: "20px 10px", width: 480 }}
              >
                Gọi đặt mua{" "}
                <span style={{ color: "#87c84a", fontWeight: 500 }}>
                  0902.504.708
                </span>{" "}
                (7:30 - 12:00)
              </p>
              <div style={{ width: 480 }}>
                <ul className="product-policises list-unstyled py-3 px-3 m-0">
                  <li>
                    <div>
                      <TbTruckDelivery
                        style={{
                          width: 45,
                          fontSize: 30,
                          color: "rgb(75 128 26)",
                        }}
                      />
                    </div>
                    <div>Giao hàng siêu tốc trong 1h</div>
                  </li>
                  <li>
                    <div>
                      <FaHandHoldingUsd
                        style={{
                          width: 45,
                          fontSize: 30,
                          color: "rgb(75 128 26)",
                        }}
                      />
                    </div>
                    <div>Combo 2 món đa dạng mỗi ngày</div>
                  </li>
                  <li>
                    <div>
                      <MdOutlinePayment
                        style={{
                          width: 45,
                          fontSize: 25,
                          color: "rgb(75 128 26)",
                        }}
                      />
                    </div>
                    <div>Thanh toán đa nền tảng</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="line"></div>
        <div className="comment">
          <h2 className="text-2xl">Hỏi đáp - Bình luận</h2>
          <p className="text-base font-medium" style={{ marginBottom: 50 }}>
            {comments.length} bình luận
          </p>
          <div>{renderComments(comments)}</div>
          <div>
            <h4 style={{ marginTop: 50 }}>Thêm bình luận</h4>
            <input
              className="setNewComment"
              placeholder="Bình luận..."
              value={newCommentText}
              onChange={handleInputChange}
            />
            <button className="submit_comment" onClick={handleAddComment}>
              Thêm
            </button>
          </div>
        </div>
        <div>
          <div className="py-1 other_products"></div>
          <div className="px-20 py-3 other_products">
            <h3 className="text-2xl font-semibold text-white">Sản phẩm khác</h3>
          </div>
          <div className="flex flex-wrap py-5">{renderOthers(others)}</div>
        </div>
      </div>
    </div>
  );
}
