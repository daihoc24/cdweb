import React from 'react';
import { Route, Routes } from "react-router-dom";
import HomeLayout from "../layout/HomeLayout/HomeLayout";
import Login from "../pages/login/Login";
import Home from "../pages/Home/Home";
import Register from "../pages/register/Register";
import Account from "../pages/Account/Account";
import withAuthGuard from "../guards/AuthGuard";
import ProductDetail from '../pages/ProductDetail/ProductDetail';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/product-detail/:productId"
          element={React.createElement(withAuthGuard(ProductDetail))}
        />
        <Route
          path="/account"
          element={React.createElement(withAuthGuard(Account))}
        />

      </Route >
    </Routes >

  )
}