import "./login.scss";
import React from "react";
import axios from "axios";
import { Button, Checkbox, CheckboxProps, Input, message } from "antd";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { UserLogin } from "../../interfaces/user";
import { userService } from "../../services/user";
import { Form, Field, ErrorMessage, Formik } from "formik";
import Swal from "sweetalert2";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const LoginSchema = Yup.object().shape({
    user_email: Yup.string().required("(*) Email không được để trống"),
    user_password: Yup.string().required("(*) Mật khẩu không được để trống"),
  });
  const handleSubmit = async (values: UserLogin, { resetForm }: any) => {
    try {
      const result = await userService.loginUser(values);

      navigate("/");
      console.log(result.data.content);

      localStorage.setItem("USER_INFO", JSON.stringify(result.data.content));

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Đăng nhập thành công",
      });

      resetForm();
    } catch (error: any) {
      resetForm();
      Swal.fire({
        icon: "error",
        title: `Error!`,
        text: "Xin hãy thử lại",
      });
    }
  };
  return (
    <Formik
      initialValues={{
        user_email: "",
        user_password: "",
      }}
      validationSchema={LoginSchema}
      onSubmit={handleSubmit}
      
    >
      <Form className="form-lg">
        <div className="relative mb-4" style={{marginTop:"100px"}}>
          <div className="font-semibold text-3xl text-blue-800 text-center" style={{color:"rgb(239 38 56)"}}>
            Đăng nhập
          </div>
        </div>
        <div style={{ width: "30%", margin: "auto" }}>
          <div className="mb-2">
            <label
              htmlFor="user_email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Email
            </label>
            <Field
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="user_email"
              type="text"
              placeholder="Email"
            />
            <span></span>
            <ErrorMessage
              name="user_email"
              component="label"
              className="form-label form-label-login text-danger"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="user_password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Mật Khẩu
            </label>
            <Field
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="user_password"
              type="password"
              placeholder="Mật khẩu"
            />
            <span></span>
            <ErrorMessage
              name="user_password"
              component="label"
              className="form-label form-label-login text-danger"
            />
          </div>
          <div className="grid grid-cols-2 items-center mb-6">
            <Link
              to="/forgot-password"
              className="text-rose-700 hover:text-rose-500 hover:underline underline-offset-4 tracking-wider duration-200 active"
            >
              Quên mật khẩu?
            </Link>

            <button
              type="submit"
              className="text-white focus:outline-none focus:ring-4  font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 w-full bg-red-500 hover:bg-red-800 duration-300"
            >
              Đăng nhập
            </button>
          </div>
          <div className="text-center">
            <p>
              Chưa có tài khoản
              <a
                className="ml-2 text-rose-700 hover:text-rose-500 hover:underline underline-offset-4 tracking-wider duration-200"
                href="/register"
              >
                Đăng ký ngay
              </a>
            </p>
          </div>
        </div>
      </Form>
    </Formik>
  );
};

export default Login;
