import React, { useState } from "react";
import { Form} from "antd";
import { FormikProps, useFormik } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { addUser, AddUserFormValues} from "../../../../interfaces/user";
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

    return
    ;
};

export default AddUser;
