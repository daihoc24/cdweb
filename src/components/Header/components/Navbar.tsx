import React from "react";
import "./navbar.scss";
import {Link} from "react-router-dom";
export default function Navbar() {
  return (
    <nav style={{ width: "40%" }}>
      <ul className="header_navbar">
        <li>
          <a href="/">
            <span>Trang chủ</span>
            <i className="fa fa-chevron-down" />
          </a>
        </li>
        <li>
          <a href="/admin">
            <span>Admin</span>
            <i className="fa fa-chevron-down" />
          </a>
        </li>
        <li>
          <a href="/product">
            <span>Thực đơn</span>
            <i className="fa fa-chevron-down" />
          </a>
        </li>
        
        <li>
          <Link to={"order-history"}>
            <a href="#">
              <span>Lịch sử mua hàng</span>
              <i className="fa fa-chevron-down"/>
            </a>
          </Link>
        </li>
        <li>
          <a href="#">
            <span>Liên hệ</span>
            <i className="fa fa-chevron-down" />
          </a>
        </li>
      </ul>
    </nav>
  );
}
