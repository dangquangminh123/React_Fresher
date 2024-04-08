import React, { useState } from 'react'
import { Button, Divider, Checkbox, Form, Input, message, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { callRegister } from '../../services/api';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async (values) => {
        const { fullName, email, password, phone } = values;
        setIsSubmit(true);
        const res = await callRegister(fullName, email, password, phone);
        setIsSubmit(false);
        // console.log('Success:', values);
        if (res?.data?._id) {
            message.success('Đăng ký tài khoảng thành công')
            navigate('/login')
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };

    return (
        <div className='register-page' style={{ padding: '50px' }}>
            <h3 style={{ textAlign: 'center' }}>Đăng ký người dùng mới</h3>
            <Divider />
            <Form
                name="basic"
                // labelCol={{ span: 8 }}
                // wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600, margin: '0px auto' }}
                // initialValues={{ remember: true }}
                onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    labelCol={{ span: 24 }}
                    label="Họ Tên"
                    name="fullName"
                    rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    labelCol={{ span: 24 }}
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Email không được để trống!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    labelCol={{ span: 24 }}
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Không được để trống Password' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    labelCol={{ span: 24 }}
                    label="phone"
                    name="phone"
                    rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 1, span: 16 }}>
                    <Button type="primary" htmlType="submit" loading={false}>
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default RegisterPage