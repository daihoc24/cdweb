import React, { useState } from "react";
import { DatePicker, Form, Input, InputNumber, Select, Switch } from "antd";
import { FormikProps, useFormik } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { addUser, AddUserFormValues, User } from "../../../../interfaces/user";
import moment from "moment";
import { userService } from "../../../../services/user";
import axios from "axios";

type SizeType = Parameters<typeof Form>[0]["size"];

const AddUser: React.FC = () => {
    const [componentSize, setComponentSize] = useState<SizeType | "default">(
        "default"
    );
    const [tinhData, setTinhData] = useState([]);
    const [quanData, setQuanData] = useState([]);
    const [phuongData, setPhuongData] = useState([]);
    const [selectedTinh, setSelectedTinh] = useState("");
    const [selectedQuan, setSelectedQuan] = useState("");

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

    const navigate = useNavigate();
    const dispatch: any = useDispatch();
    const addUserValidate = Yup.object().shape({
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
        user_password: Yup.string().required("Mật khẩu không được để trống!"),
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
    const formik: FormikProps<AddUserFormValues> = useFormik<AddUserFormValues>({
        enableReinitialize: true,
        initialValues: {
            user_fullname: "",
            user_email: "",
            user_password: "",
            user_phone: "",
            user_birthDate: "",
            user_role: "",
            sonha: "",
            ward: "",
            district: "",
            province: "",
        },
        validationSchema: addUserValidate,
        onSubmit: async (values: any) => {
            const fullAddress = `${values.sonha}, ${values.ward}, ${values.district}, ${values.province}`;
            const formData: addUser = {
                user_fullname: values.user_fullname,
                user_email: values.user_email,
                user_password: values.user_password,
                user_address: fullAddress,
                user_phone: values.user_phone,
                user_birthDate: values.user_birthDate,
                user_role: values.user_role,
            };

            await dispatch(addUser(formData));
            console.log(formData);
        },
    });
    const addUser = async (data: addUser) => {
        try {
            const result = await userService.creatUser(data);
            alert("Thêm user thành công!");
            console.log(result.data.content);
            navigate("/admin/users");
        } catch (errors) {
            console.log(errors);
        }
    };
    const handleChangeInputNumber = (name: string) => {
        return (value: number | null) => {
            formik.setFieldValue(name, value);
        };
    };
    const handleSelectChange = (name: string) => {
        return (value: string, option: any) => {
            // Lấy full_name từ option và gán vào Formik
            const selectedFullName = option ? option.label : "";
            formik.setFieldValue(name, selectedFullName); // Gán full_name vào Formik
        };
    };
    const handleChangeSelect = (name: string) => {
        return (value: string | any) => {
            formik.setFieldValue(name, value);
        };
    };
    const handleChangeDatePicker = (value: any) => {
        let user_birthDate = value ? moment(value).toISOString() : "";
        formik.setFieldValue("user_birthDate", user_birthDate);
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
            <h3 style={{ marginBottom: "20px" }}>Thêm người dùng</h3>
            <Form.Item label="Tên người dùng">
                <Input name="user_fullname" onChange={formik.handleChange} />
                {formik.errors.user_fullname && formik.touched.user_fullname && (
                    <span className="form-label text-danger" style={{ display: "block" }}>
                        {formik.errors.user_fullname}
                    </span>
                )}
            </Form.Item>
            <Form.Item label="Email">
                <Input name="user_email" onChange={formik.handleChange} />
                {formik.errors.user_email && formik.touched.user_email && (
                    <span className="form-label text-danger" style={{ display: "block" }}>
                        {formik.errors.user_email}
                    </span>
                )}
            </Form.Item>
            <Form.Item label="Password">
                <Input name="user_password" onChange={formik.handleChange} />
                {formik.errors.user_password && formik.touched.user_password && (
                    <span className="form-label text-danger" style={{ display: "block" }}>
                        {formik.errors.user_password}
                    </span>
                )}
            </Form.Item>
            <Form.Item label="Số nhà">
                <Input name="sonha" onChange={formik.handleChange} />
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
                />
                {formik.errors.district && formik.touched.district && (
                    <span className="form-label text-danger">
                        {formik.errors.district}
                    </span>
                )}
            </Form.Item>

            <Form.Item label="Phường/Xã">
                <Select onChange={handleChangeSelect("ward")}>
                    {phuongData.map(({ id, full_name }) => (
                        <Select.Option key={id} value={full_name}>
                            {full_name}
                        </Select.Option>
                    ))}
                </Select>
                {formik.errors.ward && formik.touched.ward && (
                    <span className="form-label text-danger">{formik.errors.ward}</span>
                )}
            </Form.Item>

            <Form.Item label="Số ĐT">
                <Input name="user_phone" onChange={formik.handleChange} />
                {formik.errors.user_phone && formik.touched.user_phone && (
                    <span className="form-label text-danger" style={{ display: "block" }}>
                        {formik.errors.user_phone}
                    </span>
                )}
            </Form.Item>
            <Form.Item label="Ngày sinh">
                <DatePicker format={"DD/MM/YYYY"} onChange={handleChangeDatePicker} />
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
                />
                {formik.errors.user_role && formik.touched.user_role && (
                    <span className="form-label text-danger">
                        {formik.errors.user_role}
                    </span>
                )}
            </Form.Item>
            <Form.Item label="Tác vụ">
                <button type="submit" className="btn btn-primary">
                    Thêm người dùng
                </button>
            </Form.Item>
        </Form>
    );
};

export default AddUser;
