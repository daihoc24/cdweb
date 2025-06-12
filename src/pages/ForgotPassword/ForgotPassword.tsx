import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { userService } from "../../services/user";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false); // Trạng thái gửi mã xác thực
  const [isVerified, setIsVerified] = useState(false); // Trạng thái xác thực thành công
  const [newPassword, setNewPassword] = useState(""); // Mật khẩu mới
  const navigate = useNavigate();
  // Gửi mã xác thực
  const handleSendCode = async () => {
    try {
      const response = await userService.forgotPassword(email);
      if (response.status === 404) {
        message.error(response.data.message);
      } else {
        message.success(response.data.message);
        Swal.fire({
          icon: "success",
          title: "Mã xác thực đã được gửi!",
          text: "Vui lòng kiểm tra email của bạn.",
        });
        setIsCodeSent(true); // Đã gửi mã, chuyển sang trạng thái nhập mã
      }
    } catch (error) {
      message.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
      console.error(error);
    }
  };

  // Xác thực mã
  const handleVerifyCode = async () => {
    try {
      const response = await userService.verifyForgotPasswordCode(
        email,
        verificationCode
      );
      if (response.status === 400) {
        message.error(response.data.message);
      } else {
        message.success(response.data.message);
        Swal.fire({
          icon: "success",
          title: "Xác thực thành công!",
          text: "Bạn có thể đặt lại mật khẩu mới.",
        });
        setIsVerified(true); // Đã xác thực thành công, chuyển sang nhập mật khẩu mới
      }
    } catch (error) {
      message.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
      console.error(error);
    }
  };

  // Đặt lại mật khẩu
  const handleResetPassword = async () => {
    try {
      const response = await userService.resetPassword(email, newPassword);
      message.success(response.data.message);
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Mật khẩu của bạn đã được cập nhật.",
      });
      navigate("/login")
      setEmail("");
      setVerificationCode("");
      setIsCodeSent(false);
      setIsVerified(false);
      setNewPassword("");
    } catch (error) {
      message.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
      console.error(error);
    }
  };

  return (
    <div
      className="forgot-password-form"
      style={{ width: "30%", paddingTop: "100px", margin: "auto" }}
    >
      <Form>
        {/* Nhập Email */}
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email của bạn!" }]}
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            disabled={isCodeSent || isVerified} // Khóa email sau khi gửi mã
          />
        </Form.Item>

        {/* Nhập Mã Xác Thực */}
        {isCodeSent && !isVerified && (
          <Form.Item
            label="Mã xác thực"
            name="verificationCode"
            rules={[{ required: true, message: "Vui lòng nhập mã xác thực!" }]}
          >
            <Input
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Nhập mã xác thực"
            />
          </Form.Item>
        )}

        {/* Nhập Mật Khẩu Mới */}
        {isVerified && (
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
          >
            <Input.Password
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
            />
          </Form.Item>
        )}

        {/* Button Gửi Mã, Xác Thực hoặc Đặt Lại Mật Khẩu */}
        {!isCodeSent ? (
          <Button type="primary" onClick={handleSendCode}>
            Gửi mã xác thực
          </Button>
        ) : !isVerified ? (
          <Button type="primary" onClick={handleVerifyCode}>
            Xác thực mã
          </Button>
        ) : (
          <Button type="primary" onClick={handleResetPassword}>
            Đặt lại mật khẩu
          </Button>
        )}
      </Form>
    </div>
  );
};

export default ForgotPassword;
