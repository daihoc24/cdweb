import React from 'react';
import { Route, Routes } from "react-router-dom";
import HomeLayout from "../layout/HomeLayout/HomeLayout";
import Login from "../pages/login/Login";
import Home from "../pages/Home/Home";
import Register from "../pages/register/Register";
import Account from "../pages/Account/Account";
import withAuthGuard from "../guards/AuthGuard";
import ProductDetail from '../pages/ProductDetail/ProductDetail';
import Cart from '../pages/cart/Cart';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword';
import OrderDetails from "../pages/order/OrderDetails";
import { Payment } from '@mui/icons-material';
import OrderHistoryPage from "../pages/history/OrderHistory";
import withAdminGuard from '../guards/AdminGuard';
import AdminLayout from '../layout/AdminLayout/AdminLayout';
import Products from '../pages/Admin/Product/Products';
import AddProduct from '../pages/Admin/Product/AddProduct/AddProduct';
import UpdateProduct from '../pages/Admin/Product/UpdateProduct/UpdateProduct';
import Product from '../pages/product/Product';
import Order from '../pages/order/Order';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/product-detail/:productId"
          element={React.createElement(withAuthGuard(ProductDetail))}
        />
        <Route
          path="/account"
          element={React.createElement(withAuthGuard(Account))}
        />
        <Route
          path="/cart"
          element={React.createElement(withAuthGuard(Cart))}
        />
        <Route
          path="/orderDetail/:orderId"
          element={React.createElement(withAuthGuard(OrderDetails))}
        />
        <Route
          path="/order"
          element={React.createElement(withAuthGuard(Order))}
        />
        <Route
          path="/payment/:orderId"
          element={React.createElement(withAuthGuard(Payment))}
        />
      </Route >
      <Route
        path="/product"
        element={React.createElement(withAuthGuard(Product))}
      />
      <Route
        path="/order-history"
        element={React.createElement(withAuthGuard(OrderHistoryPage))}
      />
      <Route path="/admin" element={React.createElement(withAdminGuard(AdminLayout))}>
        <Route path="/admin/products" element={<Products />} />
        <Route path="/admin/addProduct" element={<AddProduct />} />
        <Route path="/admin/updateProduct/:id" element={<UpdateProduct />} />
      </Route>

    </Routes >

  )
}