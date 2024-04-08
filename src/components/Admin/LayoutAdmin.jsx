import React, { Children, useState, useEffect } from 'react'
import './Layout.scss'
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import {
    AppstoreOutlined,
    BarChartOutlined,
    CloudOutlined,
    ShopOutlined,
    TeamOutlined,
    DownOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    MenuFoldOutlined,
    MenuOutlined,
    HeartOutlined,
    ExceptionOutlined,
    DollarOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { callLogout } from '../../services/api';
import ManageAccount from '../Account/ManageAccount';
import { doLogoutAction } from '../../redux/account/accounterSlice';
import { Layout, Menu, Dropdown, Space, Avatar, Form } from 'antd';


const { Content, Footer, Sider } = Layout;
const items = [
    {
        key: 'dashboard',
        icon: <AppstoreOutlined />,
        label: <Link to='/admin'>Dashboard</Link>
    },
    {
        icon: <UserOutlined />,
        label: <span>Manage Users</span>,
        children: [
            {
                key: 'crud',
                icon: <TeamOutlined />,
                label: <Link to='/admin/user'>CRUD</Link>
            },
            // {
            //     key: 'file1',
            //     icon: <TeamOutlined />,
            //     label: 'Files1'
            // }
        ]
    },
    {
        key: 'book',
        icon: <ExceptionOutlined />,
        label: <Link to='/admin/book'>Manage Books</Link>
    },
    {
        key: 'order',
        icon: <DollarOutlined />,
        label: <Link to='/admin/order'>Manage Orders</Link>
    }

]

const LayoutAdmin = () => {
    const [form] = Form.useForm();
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [showManageAccount, setShowManageAccount] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.account.user);
    // const userRole = user.role;
    useEffect(() => {
        if (window.location.pathname.includes('/book')) {
            setActiveMenu('book');
        }
    }, []);

    const ItemsDropdown = [
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => setShowManageAccount(true)}
            >Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <Link to="/history">Lịch sử mua hàng</Link>,
            key: 'history',
        },
        {
            label: <label style={{ cursor: 'pointer' }} onClick={() => handleLogout()}>Đăng xuất</label>,
            key: 'logout',
        },
    ]
    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res.data) {
            dispatch(doLogoutAction());
            message.success('Đăng xuất thành công');
            navigate('/');
        }
    }


    return (
        <Layout style={{ minHeight: '100vh' }} className='layout-admin'>

            <Sider
                theme='light'
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
            >
                <div style={{ height: 32, margin: 16, textAlign: 'center' }}>Admin</div>
                <Menu mode="inline" items={items} selectedKeys={[activeMenu]} onClick={(e) => setActiveMenu(e.key)} />
            </Sider>
            <Layout>
                <div className='admin-header'>
                    <span>
                        {React.createElement(collapsed ? MenuOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: () => setCollapsed(!collapsed),
                        })}
                    </span>
                    <Dropdown menu={{ items: ItemsDropdown }} trigger={['click']}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <Avatar src={urlAvatar} />
                                {user?.fullName}
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </div>
                <Content>
                    <Outlet />
                </Content>
                <Footer
                    style={{
                        padding: 0
                    }}
                >
                    &copy; 2024. Made with <HeartOutlined />
                </Footer>
            </Layout>
            <ManageAccount
                ModalOpen={showManageAccount}
                setModalOpen={setShowManageAccount}
            />
        </Layout>
    );
};


export default LayoutAdmin