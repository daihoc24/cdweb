import React, { Fragment, useEffect, useState } from "react";
import { Table, Input } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { FormikProps, useFormik } from "formik";
import { productService } from "../../../services/product";
import { listProduct } from "../../../interfaces/product";
const { Search } = Input;

const Products: React.FC = () => {
  const dispatch: any = useDispatch();

  const [productList, setProductList] = useState<listProduct[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    getProductListApi();
  }, []);
  const getProductListApi = async () => {
    try {
      const result = await productService.fetchProductApi();
      console.log(result.data.content);

      setProductList(result.data.content);
      console.log(productList);
    } catch (err) {
      console.log(err);
    }
  };
  const uploadImg = async (id: any, formFile: any) => {
    try {
      console.log("Sending request with:", formFile);
      const result = await productService.uploadImg(id, formFile);
      alert("Upload thành công!");
      window.location.reload();
    } catch (errors) {
      console.log(errors);
      alert("Có lỗi xảy ra khi upload ảnh!");
    }
  };

  const formik: FormikProps<any> = useFormik<any>({
    initialValues: {
      product_id: "",
      product_image: null,
    },
    onSubmit: async (values: any) => {
      let formFile = new FormData();
      formFile.append("file", values.product_image); 
      console.log("formFile:", formFile);
      console.log("product_id:", values.product_id);
      await dispatch(uploadImg(values.product_id, formFile));
    },
  });
  const [imgSrc, setImgSrc] = useState<any | null>("");

  const handleChangeFile = (e: any) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png")
    ) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        setImgSrc(e.target?.result);
      };

      // Cập nhật giá trị cho Formik
      formik.setFieldValue("product_image", file); // Set file vào Formik
      const id = e.target.getAttribute("data-product-id");
      formik.setFieldValue("product_id", id); // Set product_id vào Formik
    }
  };
  const fetchDelete = async (id: any) => {
    try {
      const result = await productService.deleteProduct(id);
      alert("Xoá thành công!");
      dispatch(getProductListApi());
    } catch (errors: any) {
      console.log("errors", errors.response?.data);
    }
  };
  const onSearch = async (name: any) => {
    try {
      const result = await productService.searchProductByName(name);
      const data = result.data.content;
      console.log(data);
      setProductList(data);
    } catch (errors) {
      console.log(errors);
    }
  };
  const columns: ColumnsType<listProduct> = [
    {
      title: "ID",
      dataIndex: "products_id", // Kiểm tra lại trường đúng trong dữ liệu
      sorter: (a, b) => a.products_id - b.products_id,
      sortDirections: ["descend"],
      width: 50,
    },
    {
      title: "Hình ảnh",
      dataIndex: "products_image", // Đảm bảo trường này là đúng
      render: (text, product) => {
        return (
          <Fragment>
            <img src={product.products_image} width={50} height={50} />
          </Fragment>
        );
      },
      width: 60,
    },
    {
      title: "Tên món",
      dataIndex: "products_name", // Kiểm tra lại trường đúng trong dữ liệu
      sorter: (a, b) => {
        let tenMonA = a.products_name.toLowerCase().trim();
        let tenMonB = b.products_name.toLowerCase().trim();
        if (tenMonA > tenMonB) {
          return 1;
        }
        return -1;
      },
      width: 120,
    },
    {
      title: "Loại",
      dataIndex: "products_type", // Kiểm tra lại trường đúng trong dữ liệu
      width: 50,
    },
    {
      title: "Giá tiền",
      dataIndex: "products_price", // Kiểm tra lại trường đúng trong dữ liệu
      sorter: (a, b) => a.products_price - b.products_price,
      sortDirections: ["descend"],
      width: 70,
    },
    {
      title: "Đã bán",
      dataIndex: "quantitySold", // Kiểm tra trường số lượng trong dữ liệu của bạn
      width: 70,
    },
    {
      title: "Hành động",
      dataIndex: "id",
      render: (text, product) => {
        return (
          <Fragment>
            <NavLink
              key={1}
              to={`/admin/updateProduct/${product.products_id}`}
              style={{ marginRight: "20px", fontSize: "30px", color: "blue" }}
            >
              <EditOutlined />
            </NavLink>
            <span
              key={2}
              style={{
                marginRight: "20px",
                fontSize: "30px",
                color: "red",
                cursor: "pointer",
              }}
              onClick={() => {
                if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
                  fetchDelete(product.products_id);
                }
              }}
            >
              <DeleteOutlined />
            </span>
            <input
              type="file"
              onChange={handleChangeFile}
              data-product-id={product.products_id}
              accept="image/jpeg, image/jpg, image/gif, image/png"
            />
          </Fragment>
        );
      },
      width: 180,
    },
  ];

  const handleSubmit = () => {
    formik.handleSubmit();
  };

  const data = productList;

  const onChange: TableProps<listProduct>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log(pagination, filters, sorter, extra);
  };

  return (
    <div>
      <h1 style={{ marginBottom: "20px", fontSize: "2rem" }}>
        Quản lí sản phẩm
      </h1>
      <button
        type="button"
        onClick={() => navigate(`/admin/addProduct`)}
        className="btn btn-outline-secondary "
        style={{ marginBottom: "20px", marginLeft: 0 }}
      >
        Thêm sản phẩm
      </button>
      <img src="" alt="" />
      <br></br>
      <button
        type="button"
        onClick={handleSubmit}
        className="btn btn-primary"
        style={{ marginBottom: "20px", marginLeft: 0 }}
      >
        Upload hình ảnh
      </button>
      <Search
        style={{
          marginBottom: "20px",
          backgroundColor: "#4096ff",
          borderRadius: "5px",
          height: "40px",
        }}
        onSearch={onSearch}
        placeholder="input search text"
        enterButton="Search"
        size="large"
      />
      <Table
        columns={columns}
        dataSource={data}
        onChange={onChange}
        scroll={{ x: "100%", y: 1200 }}
        sticky={true}
      />
    </div>
  );
};

export default Products;
