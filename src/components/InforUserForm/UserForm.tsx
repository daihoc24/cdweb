import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Col, DatePicker, Row, Form, Input, Button, Modal } from "antd";
import dayjs from "dayjs";
import Popup from "../Popup/Popup";
import ForgotPass from "../Header/components/ForgotPass/ForgotPass";
import { User } from "../../interfaces/user";
import { jwtDecode } from "jwt-decode";
import { userService } from "../../services/user";
import "./UserForm.scss";
import Swal from "sweetalert2";
// Định nghĩa props cho FillUserForm
interface FillUserFormProps {
  user: User;
}

const storedUser = localStorage.getItem("USER_INFO") || "{}";
let userId: number | null = null;
try {
  // Kiểm tra xem token có hợp lệ không trước khi giải mã
  const decoded: any = jwtDecode(storedUser);
  userId = decoded?.data?.id;
} catch (error) {
  console.error("Token không hợp lệ:", error);
}

const FillUserForm: React.FC<FillUserFormProps> = ({ user }) => {
  const [form] = Form.useForm(); // Form instance
  const navigate = useNavigate();
  const formatDate = (dateString: string | null) => {
    return dateString ? dayjs(dateString) : null;
  };
  // Set initial values for the form
  useEffect(() => {
    form.setFieldsValue({
      user_fullname: user.user_fullname,
      user_email: user.user_email,
      user_address: user.user_address,
      user_phone: user.user_phone,
      user_birthDate: formatDate(user.user_birthDate),
    });
  }, [form, user]);

  const handleSubmit = async (values: any) => {
  const updatedData = {
    ...values,
  };
  try {
    const response = await userService.updateUser(userId!, updatedData);

    const result = await Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Cập nhật thông tin thành công",
      confirmButtonText: "OK",
    });

    if (result.isConfirmed) {
      window.location.reload();
    }
  } catch (error) {
    console.error("Cập nhật thất bại:", error);
  }
};
  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit} className="modal-form">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Họ và tên" name="user_fullname">
            <Input className="input-custom" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Email" name="user_email">
            <Input className="input-custom" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Địa chỉ" name="user_address">
        <Input className="input-custom" />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Số điện thoại" name="user_phone">
            <Input className="input-custom" type="number" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Ngày sinh" name="user_birthDate" >
            <DatePicker className="input-custom" format="YYYY-MM-DD" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Xác nhận
        </Button>
      </Form.Item>
    </Form>
  );
};

const UserForm: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (userId) {
      const fetchUserInformation = async () => {
        try {
          const response = await userService.getUserById(userId!);
          if (response.status === 200) {
            setUser(response.data.content);
            console.log(user);
          } else {
            console.error("Failed to fetch user details");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      fetchUserInformation();
    }
  }, [userId]);

  return (
    <div className="container mx-auto">
      <div className="flex justify-center items-center">
        <div className="w-[900px]">
          <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">Thông tin người dùng</h2>
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Họ và tên">
                    <Input
                      className="input-custom"
                      value={user?.user_fullname || ""}
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Email">
                    <Input
                      className="input-custom"
                      value={user?.user_email || ""}
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Địa chỉ">
                <Input
                  className="input-custom"
                  value={user?.user_address || ""}
                  disabled
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Số điện thoại">
                    <Input
                      className="input-custom"
                      value={user?.user_phone || ""}
                      type="number"
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Ngày sinh">
                    <DatePicker
                      className="input-custom"
                      value={
                        user?.user_birthDate ? dayjs(user.user_birthDate) : null
                      }
                      format="YYYY-MM-DD"
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <div className="mx-64 mt-[20px] grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="btn-changeinfor ml-30">
                <Popup
                  btnText="Thay đổi thông tin"
                  title="Thay đổi thông tin"
                  content={<FillUserForm user={user as User} />}
                />
              </div>
              <div className="ml-20 forgotpass">
                <Popup
                  btnText="Đổi mật khẩu"
                  title="Đổi mật khẩu"
                  content={<ForgotPass />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
