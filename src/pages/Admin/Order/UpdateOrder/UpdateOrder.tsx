import * as Yup from "yup";
import React, { useState, useEffect } from "react";
import { Button, Form, Input, InputNumber, Select, Switch } from "antd";
import { FieldArray, FormikProps, useFormik } from "formik";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { orderService } from "../../../../services/order";
import {
  Order,
  updateOrdedrFormValues,
  updateOrder,
} from "../../../../interfaces/order";
import axios from "axios";
dayjs.extend(customParseFormat);

type SizeType = Parameters<typeof Form>[0]["size"];

const UpdateOrder: React.FC = () => {
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
  const { id } = useParams<any>();
  const navigate = useNavigate();
  const dispatch: any = useDispatch();
  const [orderDetail, setOrderDetail] = useState<Order>();

  useEffect(() => {
    fetchDetail();
  }, []);
  const fetchDetail = async () => {
    try {
      const result = await orderService.getOrderById(Number(id));
      console.log(result.data.content);
      setOrderDetail(result.data.content);
    } catch (errors) {
      console.log("errors", errors);
    }
  };
  const editOrderValidate = Yup.object().shape({
    status: Yup.string().required("Trạng thái không được để trống!"),
    sonha: Yup.string().required("Số nhà không được để trống!"),
    ward: Yup.string().required("Phường không được để trống!"),
    district: Yup.string().required("Huyện không được để trống!"),
    province: Yup.string().required("Tỉnh/Thành phố không được để trống!"),
    orderProducts: Yup.array()
      .of(
        Yup.object().shape({
          products_id: Yup.number()
            .required("Vui lòng chọn sản phẩm!")
            .min(1, "ID sản phẩm không hợp lệ!"),
          quantity: Yup.number()
            .required("Vui lòng nhập số lượng!")
            .min(1, "Số lượng phải lớn hơn hoặc bằng 1!"),
        })
      )
      .min(1, "Phải có ít nhất một sản phẩm trong đơn hàng!"),
  });

  const formik: FormikProps<updateOrdedrFormValues> =
    useFormik<updateOrdedrFormValues>({
      enableReinitialize: true,
      initialValues: {
        status: orderDetail?.status || "",
        sonha: orderDetail?.address?.split(", ")[0] || "",
        ward: orderDetail?.address?.split(", ")[1] || "",
        district: orderDetail?.address?.split(", ")[2] || "",
        province: orderDetail?.address?.split(", ")[3] || "",
        orderProducts: orderDetail?.OrderProduct
          ? orderDetail.OrderProduct.map((product) => ({
              products_id: product.Product?.products_id ?? 0, // Sử dụng `??` thay vì `||` để tránh việc gán giá trị 0 khi products_id là 0
              quantity: product.quantity ?? 1, // Dùng `??` để đảm bảo rằng quantity luôn là số hợp lệ
            }))
          : [],
      },

      validationSchema: editOrderValidate,
      onSubmit: async (values: any) => {
        const fullAddress = `${values.sonha}, ${values.ward}, ${values.district}, ${values.province}`;
        const formData: updateOrder = {
          status: values.status,
          address: fullAddress,
          orderProducts: values.orderProducts,
        };
        await dispatch(updateOrder(formData));
        console.log(values);
      },
    });
  useEffect(() => {
    console.log("Formik Values:", formik.values);
    console.log("Formik State:", formik);
  }, [formik.values]);
  const updateOrder = async (data: updateOrder) => {
    try {
      const result = await orderService.updateOrder(Number(id), data);
      alert("Cập nhật thành công!");
      navigate("/admin/orders");
    } catch (erors) {
      console.log(erors);
    }
  };

  const handleChangeSelect = (name: string) => {
    return (value: string | any) => {
      formik.setFieldValue(name, value); // Cập nhật giá trị của trường `name` trong Formik
    };
  };
  const handleChangeInputNumber = (name: string) => {
    return (value: number | null) => {
      formik.setFieldValue(name, value);
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
      <h3 style={{ marginBottom: "20px" }}>Cập nhật đơn hàng</h3>

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
      <Form.Item label="Trạng thái">
        <Select
          style={{ width: 120 }}
          onChange={handleChangeSelect("status")}
          options={[
            { value: "Đang xử lí", label: "Đang xử lí" },
            { value: "Đang giao hàng", label: "Đang giao hàng" },
            { value: "Đã thanh toán", label: "Đã thanh toán" },
          ]}
          value={formik.values.status}
        />
        {formik.errors.status && formik.touched.status && (
          <span className="form-label text-danger">{formik.errors.status}</span>
        )}
      </Form.Item>

      <Form.Item label="Danh sách sản phẩm">
        {formik.values.orderProducts.map((product, index) => (
          <div
            key={index}
            style={{
              marginBottom: "20px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          >
            {/* Trường products_id */}
            <Form.Item
              label={`ID sản phẩm ${index + 1}`}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 12 }}
            >
              <InputNumber
                placeholder="ID sản phẩm"
                value={product.products_id}
                min={1}
                max={1000000}
                onChange={(value) => {
                  const updatedProducts = formik.values.orderProducts.map(
                    (prod, i) =>
                      i === index ? { ...prod, products_id: value || 0 } : prod
                  );
                  formik.setFieldValue("orderProducts", updatedProducts);
                }}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label={`Số lượng sản phẩm ${index + 1}`}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 12 }}
            >
              <InputNumber
                placeholder="Số lượng"
                value={product.quantity}
                min={1}
                max={1000}
                onChange={(value) => {
                  const updatedProducts = formik.values.orderProducts.map(
                    (prod, i) =>
                      i === index ? { ...prod, quantity: value || 1 } : prod
                  );
                  formik.setFieldValue("orderProducts", updatedProducts);
                }}
                style={{ width: "100%" }}
              />
            </Form.Item>

            {/* Nút xóa sản phẩm */}
            <Form.Item wrapperCol={{ offset: 6 }}>
              <Button
                danger
                onClick={() => {
                  const updatedProducts = formik.values.orderProducts.filter(
                    (_, i) => i !== index
                  );
                  formik.setFieldValue("orderProducts", updatedProducts);
                }}
              >
                Xóa sản phẩm
              </Button>
            </Form.Item>
          </div>
        ))}

        {/* Nút thêm sản phẩm mới */}
        <Form.Item wrapperCol={{ offset: 6 }}>
          <Button
            type="dashed"
            onClick={() => {
              formik.setFieldValue("orderProducts", [
                ...formik.values.orderProducts,
                { products_id: 0, quantity: 1 },
              ]);
            }}
            style={{ marginTop: "10px" }}
          >
            Thêm sản phẩm
          </Button>
        </Form.Item>
      </Form.Item>

      <Form.Item label="Tác vụ">
        <button type="submit" className="btn btn-primary">
          Cập nhật đơn hàng
        </button>
      </Form.Item>
    </Form>
  );
};

export default UpdateOrder;
