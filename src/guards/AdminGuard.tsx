import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { notification } from "antd";
import { userService } from "../services/user";

const withAdminGuard = (Component: React.ComponentType) => {
  const AdminGuard: React.FC = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem("USER_INFO") || "{}";

      if (!token) {
        notification.warning({
          message: "Chưa đăng nhập!",
          placement: "topRight",
        });
        navigate("/login");
        return;
      }

      try {
        // Giải mã token để lấy id và email
        const decoded: any = jwtDecode(token);
        const id = decoded?.data?.id;
        console.log(id);

        // Lấy thông tin người dùng từ API để kiểm tra role
        const fetchUser = async () => {
          const result = await userService.getUserById(Number(id));
          const user = result.data.content;
          console.log(user);

          if (!result || user.user_role !== "admin") {
            notification.warning({
              message: "Bạn không có quyền truy cập trang này!",
              placement: "topRight",
            });
            navigate("/");
          }
        };

        fetchUser();
      } catch (error) {
        console.error("Token giải mã thất bại:", error);
        notification.error({
          message: "Token không hợp lệ",
          placement: "topRight",
        });
        navigate("/login");
      }
    }, [navigate]);

    return <Component {...props} />;
  };

  return AdminGuard;
};

export default withAdminGuard;
