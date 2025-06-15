import * as Yup from "yup";
import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Select, Switch } from "antd";
import { FormikProps, useFormik } from "formik";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { productService } from "../../../../services/product";
import {
  addComment,
  addProduct,
  listProduct,
} from "../../../../interfaces/product";

type SizeType = Parameters<typeof Form>[0]["size"];

const UpdateProduct: React.FC = () => {
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };
  // const [imgSrc, setImgSrc] = useState<any | null>("");
  const { id } = useParams<any>();
  const navigate = useNavigate();
  const dispatch: any = useDispatch();
  const [productDetail, setproductDetail] = useState<listProduct>();
  console.log(productDetail);

  useEffect(() => {
    fetchDetail();
  }, []);
  const fetchDetail = async () => {
    try {
      const result = await productService.fetchProductDetailApi(Number(id));
      console.log(result.data.content);
      setproductDetail(result.data.content);
    } catch (errors) {
      console.log("errors", errors);
    }
  };
  const editRoomValidate = Yup.object().shape({
    products_name: Yup.string()
      .required("Tên sản phẩm không được để trống!")
      .matches(
        /^[ aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẽéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9]+$/,
        "Vui lòng nhập đúng định dạng!"
      ),
    products_price: Yup.number()
      .required("Vui lòng nhập giá tiền!")
      .min(1, "Vui lòng nhập giá tiền!")
      .max(1000000, "Vui lòng nhập đúng yêu cầu(1-1000000)"),
    products_type: Yup.string().required("Loại san phẩm không được để trống!"),
  });

  const formik: FormikProps<addProduct> = useFormik<addProduct>({
    enableReinitialize: true,
    initialValues: {
      products_name: productDetail?.products_name || "",
      products_price: productDetail?.products_price ?? 0,
      products_type: productDetail?.products_type || "",
    },
    validationSchema: editRoomValidate,
    onSubmit: async (values: any) => {
      console.log(values);
      await dispatch(updateProduct(values));
    },
  });
  const updateProduct = async (formData: addProduct) => {
    try {
      const result = await productService.updateProduct(Number(id), formData);
      console.log(result.data.content);
      alert("Cập nhật thành công!");
      navigate("/admin/products");
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
      <h3 style={{ marginBottom: "20px" }}>Cập nhật sản phẩm</h3>

      <Form.Item label="Tên sản phẩm">
        <Input
          name="products_name"
          onChange={formik.handleChange}
          value={formik.values.products_name}
        />
        {formik.errors.products_name && formik.touched.products_name && (
          <span className="form-label text-danger" style={{ display: "block" }}>
            {formik.errors.products_name}
          </span>
        )}
      </Form.Item>

      <Form.Item label="Giá tiền">
        <InputNumber
          onChange={handleChangeInputNumber("products_price")}
          min={1}
          max={1000000}
          value={formik.values.products_price}
        />
        {formik.errors.products_price && formik.touched.products_price && (
          <span
            className="form-label text-danger"
            style={{ marginLeft: "10px" }}
          >
            {formik.errors.products_price}
          </span>
        )}
      </Form.Item>
      <Form.Item label="Loại sản phẩm">
        <Select
          defaultValue="Chọn loại sản phẩm"
          style={{ width: 120 }}
          onChange={handleChangeSelect("products_type")}
          options={[
            { value: "Combo", label: "Combo" },
            { value: "Cơm", label: "Cơm" },
            { value: "Mì", label: "Mì" },
            { value: "Miến", label: "Miến" },
            { value: "Phá lấu", label: "Phá lấu" },
            { value: "Nước giải khát", label: "Nước giải khát" },
            { value: "Các món khác", label: "Các món khác" },
          ]}
          value={formik.values.products_type}
        />
        {formik.errors.products_type && formik.touched.products_type && (
          <span className="form-label text-danger">
            {formik.errors.products_type}
          </span>
        )}
      </Form.Item>

      <Form.Item label="Tác vụ">
        <button type="submit" className="btn btn-primary">
          Cập nhật sản phẩm
        </button>
      </Form.Item>
    </Form>
  );
};

export default UpdateProduct;
