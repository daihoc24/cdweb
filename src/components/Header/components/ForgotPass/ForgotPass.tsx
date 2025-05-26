import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { userService } from "../../../../services/user";
import { jwtDecode } from "jwt-decode";

export default function ForgotPass() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const storedUser = localStorage.getItem("USER_INFO") || "{}";
  const decoded: any = jwtDecode(storedUser);
  const userId = decoded?.data?.id;
  const handleSubmit = async () => {
    // Kiểm tra nếu mật khẩu mới và mật khẩu xác nhận không khớp
    if (newPassword !== confirmPassword) {
      message.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    try {
      // Giả sử bạn có một API userService.updatePassword để cập nhật mật khẩu
      const response = await userService.updatePassword(userId, {
        currentPassword,
        newPassword,
      });

      if (response.status === 200) {
        message.success("Mật khẩu đã được thay đổi thành công!");
        window.location.reload();
      } else {
        message.error("Có lỗi xảy ra trong quá trình thay đổi mật khẩu.");
      }
    } catch (error) {
      message.error("Lỗi kết nối với server. Vui lòng thử lại.");
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <Form onFinish={handleSubmit}>
        <Form.Item
          label="Nhập mật khẩu hiện tại"
          name="currentPassword"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
          ]}
        >
          <Input.Password
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Nhập mật khẩu hiện tại"
          />
        </Form.Item>

        <Form.Item
          label="Nhập mật khẩu mới"
          name="newPassword"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
        >
          <Input.Password
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
          />
        </Form.Item>

        <Form.Item
          label="Nhập lại mật khẩu mới"
          name="confirmPassword"
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
          ]}
        >
          <Input.Password
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginLeft: "250px" }}
          >
            Cập nhật mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
