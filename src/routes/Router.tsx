import { Route, Routes } from "react-router-dom";
import HomeLayout from "../layout/HomeLayout/HomeLayout";
import Login from "../pages/login/Login";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route path="/login" element={<Login />} />
      </Route >
    </Routes >
    )
}