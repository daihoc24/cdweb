import React, { useState } from "react";
import {
    AreaChartOutlined,
    DesktopOutlined,
    FileOutlined,
    OrderedListOutlined,
    PieChartOutlined,
    ProductOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";

import { Breadcrumb, Layout, Menu, MenuProps, theme } from "antd";
import { NavLink, Outlet } from "react-router-dom";
import SubMenu from "antd/es/menu/SubMenu";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const AdminLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
            >
                <div className="demo-logo-vertical" />
                <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
                    <Menu.Item key="1" icon={<UserOutlined />}>
                        <NavLink to="/admin/users">Users</NavLink>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<ProductOutlined />}>
                        <NavLink to="/admin/products">Products</NavLink>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<OrderedListOutlined />}>
                        <NavLink to="/admin/orders">Orders</NavLink>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<AreaChartOutlined />}>
                        <NavLink to="/admin/statistics">Statistics</NavLink>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }} />
                <Content style={{ margin: "0 16px" }}>
                    <Breadcrumb
                        style={{
                            margin: "16px 0",
                        }}
                    >
                        {/* <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item> */}
                        <Breadcrumb>
                            <NavLink to={"/"}>Home</NavLink>
                        </Breadcrumb>
                    </Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{ textAlign: "center" }}>
                    Ant Design ©2023 Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;