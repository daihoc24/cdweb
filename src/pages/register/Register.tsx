import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, DatePicker, Select, message } from "antd";
import "./register.scss";
import { userService } from "../../services/user";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const { Option } = Select;

const Register: React.FC = () => {
  interface Tinh {
    id: string;
    full_name: string;
  }

  interface Quan {
    id: string;
    full_name: string;
  }

  interface Phuong {
    id: string;
    full_name: string;
  }

  const [tinhData, setTinhData] = useState<Tinh[]>([]);
  const [quanData, setQuanData] = useState<Quan[]>([]);
  const [phuongData, setPhuongData] = useState<Phuong[]>([]);
  const [form] = Form.useForm();
  const [selectedTinh, setSelectedTinh] = useState("");
  const [selectedQuan, setSelectedQuan] = useState("");
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();
  // Fetch tỉnh/thành
  React.useEffect(() => {
    axios
      .get("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((response) => setTinhData(response.data.data))
      .catch((error) => console.error("Error fetching tinh data:", error));
  }, []);

  const handleTinhChange = (value: string) => {
    setSelectedTinh(value);
    axios
      .get(`https://esgoo.net/api-tinhthanh/2/${value}.htm`)
      .then((response) => {
        setQuanData(response.data.data);
        setSelectedQuan("");
        setPhuongData([]);
      })
      .catch((error) => console.error("Error fetching quan data:", error));
  };

  const handleQuanChange = (value: string) => {
    setSelectedQuan(value);
    axios
      .get(`https://esgoo.net/api-tinhthanh/3/${value}.htm`)
      .then((response) => setPhuongData(response.data.data))
      .catch((error) => console.error("Error fetching phuong data:", error));
  };

  const onRegisterFinish = async (values: any) => {
    try {
      // Gộp các phần của địa chỉ thành một chuỗi duy nhất
      const fullAddress = `${values.sonha}, ${values.phuong}, ${getQuanName(selectedQuan)}, ${getTinhName(selectedTinh)}`;

      // Tạo đối tượng user data, bao gồm địa chỉ đã gộp
      const userData = {
        user_fullname: values.user_fullname,
        user_email: values.user_email,
        user_password: values.user_password,
        user_address: fullAddress, // Sử dụng chuỗi địa chỉ đã gộp
        user_phone: values.user_phone,
        user_birthDate: values.user_birthDate,
      };

      const response = await userService.signUp(userData);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Đăng ký thành công. Vui lòng nhập mã xác thực!",
      });
      setEmail(values.user_email);
      setVerificationCode(response.data.content);
      setIsVerificationStep(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: `Error!`,
        text: "Đăng ký thất bại. Vui lòng thử lại!",
      });
    }
  };
  const getTinhName = (id: string) => {
    const tinh = tinhData.find((t) => t.id === id);
    return tinh ? tinh.full_name : "";
  };

  const getQuanName = (id: string) => {
    const quan = quanData.find((q) => q.id === id);
    return quan ? quan.full_name : "";
  };
  const onVerificationFinish = async () => {
    try {
      const response = await userService.verifyEmail(email, verificationCode);
      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.data.message || "Xác thực thành công!",
        });
        setIsVerificationStep(false);
        navigate("/login");
      } else {
        Swal.fire({
          icon: "error",
          title: `Error!`,
          text: "Xác thực thất bại. Kiểm tra lại thông tin!",
        });
      }
    } catch (error: any) {
      message.error(
        "Đã xảy ra lỗi trong quá trình xác thực. Vui lòng thử lại!"
      );
    }
  };

  return (
    <div className="register-container" style={{ marginTop: "100px" }}>
      {isVerificationStep ? (
        <Form
          form={form}
          name="verification"
          onFinish={onVerificationFinish}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            label="Mã xác thực"
            name="verificationCode"
            rules={[{ required: true, message: "Vui lòng nhập mã xác thực!" }]}
          >
            <Input
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Xác thực
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Form
          className="register"
          form={form}
          name="register"
          onFinish={onRegisterFinish}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          scrollToFirstError
          style={{
            height: "600px",
            width: "50%",
            padding: "20px",
            margin: "auto",
            marginBottom: "50px",
          }}
        >
          <Form.Item
            name="user_email"
            label="E-mail"
            rules={[
              { type: "email", message: "E-mail không hợp lệ!" },
              { required: true, message: "Hãy nhập địa chỉ email!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="user_password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Hãy nhập mật khẩu!" }]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="user_fullname"
            label="Họ và tên"
            rules={[
              {
                required: true,
                message: "Hãy nhập họ và tên!",
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="sonha"
            label="Số nhà"
            rules={[{ required: true, message: "Hãy nhập số nhà!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="province"
            label="Tỉnh Thành"
            rules={[{ required: true, message: "Hãy chọn tỉnh thành!" }]}
          >
            <Select value={selectedTinh} onChange={handleTinhChange}>
              <Option value="">Chọn Tỉnh Thành</Option>
              {tinhData.map(({ full_name, id }) => (
                <Option key={id} value={id}>
                  {full_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="quan"
            label="Quận Huyện"
            rules={[{ required: true, message: "Hãy chọn quận huyện!" }]}
          >
            <Select value={selectedQuan} onChange={handleQuanChange}>
              <Option value="">Chọn Quận Huyện</Option>
              {quanData.map(({ full_name, id }) => (
                <Option key={id} value={id}>
                  {full_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="phuong"
            label="Phường/Xã"
            rules={[{ required: true, message: "Hãy chọn phường/xã!" }]}
          >
            <Select>
              {phuongData.map(({ full_name, id }) => (
                <Option key={id} value={full_name}>
                  {full_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="user_phone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Hãy nhập số điện thoại!" }]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="user_birthDate"
            label="Ngày sinh"
            rules={[{ required: true, message: "Hãy chọn ngày sinh!" }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button className="submit" type="primary" htmlType="submit">
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default Register;
