import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { userService } from "../../../services/user";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { ColumnsType, TableProps } from "antd/es/table";
import { Input, Table } from "antd";
import { User } from "../../../interfaces/user";
const { Search } = Input;

const Users: React.FC = () => {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();

  const [usersList, setUsersList] = useState<User[]>([]);
  console.log(usersList);

  useEffect(() => {
    getUsersListApi();
  }, []);
  const getUsersListApi = async () => {
    try {
      const result = await userService.getListUser();
      setUsersList(result.data.content);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchDelete = async (id: any) => {
    try {
      const result = await userService.deleteUser(id);
      alert("Xoá thành công!");
      dispatch(getUsersListApi());
    } catch (errors: any) {
      console.log("errors", errors.response?.data);
    }
  };
  const onSearch = async (name: any) => {
    try {
      const result = await userService.searchUserByName(name);
      const data = result.data.content;
      console.log(data);
      setUsersList(data);
    } catch (errors) {
      console.log(errors);
    }
  };
  const columns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "user_id",
      sorter: (a, b) => a.user_id - b.user_id,
      sortDirections: ["descend"],
      width: 50,
    },
    {
      title: "Full Name",
      dataIndex: "user_fullname",
      sorter: (a, b) => {
        let fullNameA = a.user_fullname.toLowerCase().trim();
        let fullNameB = b.user_fullname.toLowerCase().trim();
        if (fullNameA > fullNameB) {
          return 1;
        }
        return -1;
      },
      width: 175,
    },
    {
      title: "Email",
      dataIndex: "user_email",
      width: 125,
    },
    {
      title: "Địa chỉ",
      dataIndex: "user_address",
      width: 250,
    },
    {
      title: "Số điện thoại",
      dataIndex: "user_phone",
      width: 100,
    },
    {
      title: "Ngày sinh",
      dataIndex: "user_birthDate",
      width: 150,
    },
    {
      title: "Role",
      dataIndex: "user_role",
      width: 150,
    },
    {
      title: "Hành động",
      dataIndex: "id",
      render: (text, user) => {
        return (
          <Fragment>
            <NavLink
              key={1}
              to={`/admin/updateUser/${user.user_id}`}
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
                if (
                  window.confirm("Bạn có chắc muốn xóa người dùng này không?")
                ) {
                  fetchDelete(user.user_id);
                }
              }}
            >
              <DeleteOutlined />
            </span>
          </Fragment>
        );
      },
      width: 200,
    },
  ];

  const data = usersList;
  const onChange: TableProps<User>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  return (
    <div>
      <h1 style={{ marginBottom: "20px", fontSize: "2rem" }}>
        Quản lí người dùng
      </h1>
      <button
        type="button"
        onClick={() => navigate(`/admin/addUser`)}
        className="btn btn-outline-secondary "
        style={{ marginBottom: "20px", marginLeft: 0 }}
      >
        Thêm người dùng
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
      <Table columns={columns} dataSource={data} onChange={onChange} />
    </div>
  );
};
export default Users;
