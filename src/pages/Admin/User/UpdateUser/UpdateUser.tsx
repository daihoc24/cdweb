import * as Yup from "yup";
import React, { useState, useEffect } from "react";
import { DatePicker, Form, Input, InputNumber, Select, Switch } from "antd";
import { FormikProps, useFormik } from "formik";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { productService } from "../../../../services/product";
import {
  addUser,
  AddUserFormValues,
  updateUser,
  UpdateUserFormValues,
  User,
} from "../../../../interfaces/user";
import moment from "moment";
import { userService } from "../../../../services/user";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";
dayjs.extend(customParseFormat);

type SizeType = Parameters<typeof Form>[0]["size"];

const UpdateUser: React.FC = () => {
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );
  const [tinhData, setTinhData] = useState([]);
  const [quanData, setQuanData] = useState([]);
  const [phuongData, setPhuongData] = useState([]);
  const [selectedTinh, setSelectedTinh] = useState("");
  const [selectedQuan, setSelectedQuan] = useState("");
  const handleSelectChange = (name: string) => {
    return (value: string, option: any) => {
      // Lấy full_name từ option và gán vào Formik
      const selectedFullName = option ? option.label : "";
      formik.setFieldValue(name, selectedFullName); // Gán full_name vào Formik
    };
  };
  React.useEffect(() => {
    axios
      .get("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((response) => setTinhData(response.data.data))
      .catch((error) => console.error("Error fetching tinh data:", error));
  }, []);

  const handleTinhChange = (value: string, option: any) => {
    handleSelectChange("province")(value, option);
    setSelectedTinh(value);
    axios
      .get(`https://esgoo.net/api-tinhthanh/2/${value}.htm`)
      .then((response) => {
        setQuanData(response.data.data);
        console.log(quanData);

        setSelectedQuan("");
        setPhuongData([]);
      })
      .catch((error) => console.error("Error fetching quan data:", error));
  };

  const handleQuanChange = (value: string, option: any) => {
    handleSelectChange("district")(value, option);
    setSelectedQuan(value);
    axios
      .get(`https://esgoo.net/api-tinhthanh/3/${value}.htm`)
      .then((response) => {
        setPhuongData(response.data.data);
        console.log(phuongData);
      })
      .catch((error) => console.error("Error fetching phuong data:", error));
  };
  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };
  // const [imgSrc, setImgSrc] = useState<any | null>("");
  const { userId } = useParams<any>();
  const navigate = useNavigate();
  const dispatch: any = useDispatch();
  const [userDetail, setUserDetail] = useState<updateUser>();
  console.log(userDetail);

  useEffect(() => {
    fetchDetail();
  }, []);
  const fetchDetail = async () => {
    try {
      const result = await userService.getUserById(Number(userId));
      console.log(result.data.content);
      setUserDetail(result.data.content);
    } catch (errors) {
      console.log("errors", errors);
    }
  };
  const editUserValidate = Yup.object().shape({
    user_fullname: Yup.string()
      .required("Tên người dùng không được để trống!")
      .matches(
        /^[ aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ]+$/,
        "Vui lòng nhập đúng định dạng!"
      ),
    user_email: Yup.string()
      .required("Email không được để trống!")
      .matches(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Vui lòng nhập đúng định dạng!"
      ),
    user_phone: Yup.string()
      .required("Số điện thoại không được để trống!")
      .matches(/^[0-9]+$/, "Vui lòng nhậ đúng định dạng!"),
    user_birthDate: Yup.string().required("Ngày sinh không được để trống!"),
    user_role: Yup.string().required("Role không được để trống!"),
    sonha: Yup.string().required("Số nhà không được để trống!"),
    ward: Yup.string().required("Phường không được để trống!"),
    district: Yup.string().required("Huyện không được để trống!"),
    province: Yup.string().required("Tỉnh/Thành phố không được để trống!"),
  });

  const formik: FormikProps<UpdateUserFormValues> =
    useFormik<UpdateUserFormValues>({
      enableReinitialize: true,
      initialValues: {
        user_fullname: userDetail?.user_fullname || "",
        user_email: userDetail?.user_email || "",
        user_phone: userDetail?.user_phone || "",
        user_birthDate: userDetail?.user_birthDate || "",
        user_role: userDetail?.user_role || "",
        sonha: userDetail?.user_address?.split(", ")[0] || "",
        ward: userDetail?.user_address?.split(", ")[1] || "",
        district: userDetail?.user_address?.split(", ")[2] || "",
        province: userDetail?.user_address?.split(", ")[3] || "",
      },
      validationSchema: editUserValidate,
      onSubmit: async (values: any) => {
        const fullAddress = `${values.sonha}, ${values.ward}, ${values.district}, ${values.province}`;
        const formData: updateUser = {
          user_fullname: values.user_fullname,
          user_email: values.user_email,
          user_address: fullAddress,
          user_phone: values.user_phone,
          user_birthDate: values.user_birthDate,
          user_role: values.user_role,
        };
        console.log(values);
        await dispatch(updateUser(formData));
      },
    });
  const updateUser = async (data: any) => {
    try {
      const result = await userService.updateUser(Number(userId), data);
      console.log(result.data.content);
      alert("Cập nhật thành công!");
      navigate("/admin/users");
    } catch (erors) {
      console.log(erors);
    }
  };
  const handleChangeInputNumber = (name: string) => {
    return (value: number | null) => {
      formik.setFieldValue(name, value);
    };
  };
  const handleChangeSelect = (name: string) => {
    return (value: string | any) => {
      formik.setFieldValue(name, value); // Cập nhật giá trị của trường `name` trong Formik
    };
  };
  const handleChangeSwitch = (name: string) => {
    return (value: boolean) => {
      formik.setFieldValue(name, value);
    };
  };
  const handleChangeDatePicker = (date: dayjs.Dayjs | null) => {
    if (date) {
      formik.setFieldValue("user_birthDate", date.toISOString());
    } else {
      formik.setFieldValue("user_birthDate", null);
    }
  };
  return (
    <Form
      onSubmitCapture={formik.handleSubmit}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      initialValues={{ size: componentSize }}
      onValuesChange={onFormLayoutChange}
      size={componentSize as SizeType}
      style={{ maxWidth: 880 }}
    >
      <h3 style={{ marginBottom: "20px" }}>Cập nhật người dùng</h3>
      <Form.Item label="Tên người dùng">
        <Input
          name="user_fullname"
          onChange={formik.handleChange}
          value={formik.values.user_fullname}
        />
        {formik.errors.user_fullname && formik.touched.user_fullname && (
          <span className="form-label text-danger" style={{ display: "block" }}>
            {formik.errors.user_fullname}
          </span>
        )}
      </Form.Item>
      <Form.Item label="user_email">
        <Input
          name="user_email"
          onChange={formik.handleChange}
          value={formik.values.user_email}
        />
        {formik.errors.user_email && formik.touched.user_email && (
          <span className="form-label text-danger" style={{ display: "block" }}>
            {formik.errors.user_email}
          </span>
        )}
      </Form.Item>
      <Form.Item label="Số nhà">
        <Input
          name="sonha"
          onChange={formik.handleChange}
          value={formik.values.sonha}
        />
        {formik.errors.sonha && formik.touched.sonha && (
          <span className="form-label text-danger" style={{ display: "block" }}>
            {formik.errors.sonha}
          </span>
        )}
      </Form.Item>
      <Form.Item label="Tỉnh/Thành phố">
        <Select
          defaultValue="Chọn tỉnh"
          style={{ width: 200 }}
          onChange={handleTinhChange} // Gọi handleTinhChange
          options={tinhData.map(({ id, full_name }) => ({
            value: id,
            label: full_name,
          }))}
          value={formik.values.province}
        />
        {formik.errors.province && formik.touched.province && (
          <span className="form-label text-danger">
            {formik.errors.province}
          </span>
        )}
      </Form.Item>
      <Form.Item label="Quận/Huyện">
        <Select
          defaultValue="Chọn Quận/Huyện"
          style={{ width: 200 }}
          onChange={handleQuanChange}
          options={quanData.map(({ id, full_name }) => ({
            value: id,
            label: full_name,
          }))}
          value={formik.values.district}
        />
        {formik.errors.district && formik.touched.district && (
          <span className="form-label text-danger">
            {formik.errors.district}
          </span>
        )}
      </Form.Item>
      <Form.Item label="Phường/Xã">
        <Select
          onChange={handleChangeSelect("ward")}
          value={formik.values.ward}
        >
          {phuongData.map(({ id, full_name }) => (
            <Select.Option key={id} value={full_name}>
              {full_name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Số ĐT">
        <Input
          name="user_phone"
          onChange={formik.handleChange}
          value={formik.values.user_phone}
        />
        {formik.errors.user_phone && formik.touched.user_phone && (
          <span className="form-label text-danger" style={{ display: "block" }}>
            {formik.errors.user_phone}
          </span>
        )}
      </Form.Item>
      <Form.Item label="Ngày sinh">
        <DatePicker
          format="DD/MM/YYYY"
          value={
            formik.values.user_birthDate
              ? dayjs(formik.values.user_birthDate)
              : null
          }
          onChange={handleChangeDatePicker}
        />
        {formik.errors.user_birthDate && formik.touched.user_birthDate && (
          <span className="form-label text-danger" style={{ display: "block" }}>
            {formik.errors.user_birthDate}
          </span>
        )}
      </Form.Item>
      <Form.Item label="Loại sản phẩm">
        <Select
          defaultValue="Chọn loại sản phẩm"
          style={{ width: 120 }}
          onChange={handleChangeSelect("user_role")}
          options={[
            { value: "admin", label: "admin" },
            { value: "user", label: "user" },
          ]}
          value={formik.values.user_role}
        />
        {formik.errors.user_role && formik.touched.user_role && (
          <span className="form-label text-danger">
            {formik.errors.user_role}
          </span>
        )}
      </Form.Item>
      <Form.Item label="Tác vụ">
        <button type="submit" className="btn btn-primary">
          Cập nhật người dùng
        </button>
      </Form.Item>
    </Form>
  );
};

export default UpdateUser;
