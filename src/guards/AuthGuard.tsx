import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";

const withAuthGuard = (Component: React.ComponentType) => {
    const AuthGuard: React.FC = (props) => {
      const navigate = useNavigate();
  
      useEffect(() => {
        const user = localStorage.getItem("USER_INFO") 
  
        if (!user) {
          notification.warning({
            message: "Chưa đăng nhập!",
            placement: "topRight",
          });
          navigate("/login");
        }
      }, [navigate]);
  
      return <Component {...props} />;
    };
  
    return AuthGuard;
  };
  
  export default withAuthGuard;
