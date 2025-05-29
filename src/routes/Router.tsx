import { Route, Routes } from "react-router-dom";
import HomeLayout from "../layout/HomeLayout/HomeLayout";
import Login from "../pages/login/Login";
import Home from "../pages/Home/Home";
import Register from "../pages/register/Register";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
      </Route >
    </Routes >
  )
}