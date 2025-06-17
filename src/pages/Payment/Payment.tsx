import React from "react";
import { Button, Input, Form as AntForm } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik, FormikProps } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { paymentService } from "../../services/payment";
import { payment } from "../../interfaces/payment";
import "./Payment.scss";
const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  // Schema xác thực với Yup
  const PaymentSchema = Yup.object().shape({
    account_number: Yup.string().required(
      "(*) Số tài khoản không được để trống"
    ),
    account_name: Yup.string().required(
      "(*) Tên tài khoản không được để trống"
    ),
    bank_name: Yup.string().required("(*) Tên ngân hàng không được để trống"),
    content: Yup.string().required(
      "(*) Nội dung thanh toán không được để trống"
    ),
    amount: Yup.number()
      .required("(*) Số tiền không được để trống")
      .positive("(*) Số tiền phải là số dương"),
  });

  // Xử lý khi người dùng gửi form
  const handleSubmit = async (values: payment) => {
    try {
      const result = await paymentService.validatePayment(Number(orderId), values);
      console.log(result.data.content);
      // Nếu thanh toán thành công
      Swal.fire({
        icon: "success",
        title: "Thanh toán thành công!",
        text: result.data.message,
      });
      if(result.data.content.message==="Số tiền thanh toán không đủ!"){
        Swal.fire({
            icon: "error",
            title: "Thanh toán không thành công!",
            text: result.data.content.message,
          });
      }

      // Điều hướng đến trang thanh toán thành công
      navigate("/order-history");
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Đã xảy ra lỗi",
        text: "Xin vui lòng thử lại sau",
      });
    }
  };

  // Khởi tạo Formik
  const formik: FormikProps<payment> = useFormik<payment>({
    initialValues: {
      account_number: "",
      account_name: "",
      bank_name: "",
      content: "",
      amount: 0,
    },
    validationSchema: PaymentSchema,
    onSubmit: handleSubmit, // Xử lý khi người dùng submit form
  });

  return (
    <div className="payment-form">
      <h2>Thanh toán</h2>
      <AntForm onFinish={formik.handleSubmit}>
        {/* Tài khoản */}
        <AntForm.Item
          label="Số tài khoản"
          validateStatus={formik.touched.account_number && formik.errors.account_number ? "error" : ""}
          help={formik.touched.account_number && formik.errors.account_number}
        >
          <Input
            name="account_number"
            value={formik.values.account_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </AntForm.Item>

        {/* Tên tài khoản */}
        <AntForm.Item
          label="Tên tài khoản"
          validateStatus={formik.touched.account_name && formik.errors.account_name ? "error" : ""}
          help={formik.touched.account_name && formik.errors.account_name}
        >
          <Input
            name="account_name"
            value={formik.values.account_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </AntForm.Item>

        {/* Tên ngân hàng */}
        <AntForm.Item
          label="Tên ngân hàng"
          validateStatus={formik.touched.bank_name && formik.errors.bank_name ? "error" : ""}
          help={formik.touched.bank_name && formik.errors.bank_name}
        >
          <Input
            name="bank_name"
            value={formik.values.bank_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </AntForm.Item>

        {/* Nội dung */}
        <AntForm.Item
          label="Nội dung thanh toán"
          validateStatus={formik.touched.content && formik.errors.content ? "error" : ""}
          help={formik.touched.content && formik.errors.content}
        >
          <Input
            name="content"
            value={formik.values.content}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </AntForm.Item>

        {/* Số tiền */}
        <AntForm.Item
          label="Số tiền"
          validateStatus={formik.touched.amount && formik.errors.amount ? "error" : ""}
          help={formik.touched.amount && formik.errors.amount}
        >
          <Input
            type="number"
            name="amount"
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </AntForm.Item>

        {/* Nút gửi và hủy */}
        <AntForm.Item>
          <Button type="primary" htmlType="submit">
            Xác nhận thanh toán
          </Button>
          <Button
            type="default"
            onClick={() => formik.resetForm()}
            style={{ marginLeft: "10px" }}
          >
            Hủy
          </Button>
        </AntForm.Item>
      </AntForm>
    </div>
  );
};

export default Payment;
