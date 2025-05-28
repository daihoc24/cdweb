import { NavLink, useNavigate } from "react-router-dom";
import "./Header.scss";
import Navbar from "./components/Navbar";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { LiaPhoneVolumeSolid } from "react-icons/lia";

const Header: React.FC = () => {
  const navigate = useNavigate();
  //const { cartItemCount } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  const handleCartToggle = () => {
    navigate("/cart")
  };

  const isLoggedIn = !!(
    localStorage.getItem("USER_INFO")
  );

  const handleLogout = () => {
    localStorage.removeItem("USER_INFO");
    navigate("/")
  };
  return (
    <div className="header">
      <div className="header_container">
        <div className="mtw_banner_top_content" style={{ width: "5%" }}>
          <a href="#">
            <img src="/img/logo.png" width="80" height="80" alt="logo" />
          </a>
        </div>
        <Navbar />
        <div
          className="flex justify-center items-center"
          style={{ width: "16%" }}
        >
          <div>
            <p style={{ marginBottom: 0 }}>Giao hàng tận nơi</p>
            <p style={{ color: "#87c84a" }}>0902.504.708</p>
          </div>
        </div>
        <div className="right_header">
          <UserOutlined
            className="account"
            style={{
              transition: "all 0.3s",
              fontSize: 28,
              marginRight: 15,
              cursor: "pointer",
              padding: 6,
              borderRadius: "50%",
              backgroundColor: "#e6e6e6",
            }}
            onClick={handleToggle}
          />
          <ul className={`account_option ${isVisible ? "visible" : "hidden"}`}>
            {isLoggedIn ? (
              <li>
                <a className="logout" href="#" onClick={handleLogout}>
                  Đăng xuất
                </a>
              </li>
            ) : (
              <li>
                <NavLink className="loginPage" to="/login">
                 Đăng nhập
                </NavLink>
              </li>
            )}
            <li>
              <a className="cartPage" href="#" onClick={handleCartToggle}>
               Giỏ hàng
              </a>
            </li>
            <li>
              <NavLink className="myAccount" to="/account">
              Tài khoản
              </NavLink>
            </li>
          </ul>
          <NavLink to={"/cart"}>
            <ShoppingCartOutlined
              className="cart"
              style={{
                position: "relative",
                transition: "all 0.3s",
                fontSize: 28,
                marginRight: 15,
                cursor: "pointer",
                padding: 6,
                borderRadius: "50%",
                backgroundColor: "#e6e6e6",
              }}
            />
          </NavLink>

          {/* <span className="cart-count">{cartItemCount}</span> */}
        </div>
      </div>
    </div>
  );
};

export default Header;
