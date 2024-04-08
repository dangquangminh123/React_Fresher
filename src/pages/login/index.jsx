import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { Button, Divider, Checkbox, Form, Input, message, notification } from 'antd';
import { callLogin } from '../../services/api';
import { doLoginAction } from '../../redux/account/accounterSlice';
import { useDispatch } from 'react-redux';
const LoginPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const dispatch = useDispatch();

    const onFinish = async (values) => {
        // const { email, password } = values;

        //cái email và password là name của input => lấy từ form của antd ra
        const hoidanit = values.email;
        const password = values.password;
        setIsSubmit(true);
        //chỉ biết rằng, tham số 1 có giá trị là hoidanit, tham số 2 có giá trị là password.
        //ở đây. del quan tâm tên biến, chỉ quan tâm giá trị truyền qua hàm callLogin
        const res = await callLogin(hoidanit, password);

        setIsSubmit(false);

        if (res?.data) {
            localStorage.setItem('access_token', res.data.access_token);
            dispatch(doLoginAction(res.data.user));
            // console.log("check data", res)
            message.success('Đăng nhập thành công');
            navigate('/');
        } else {
            notification.error({
                message: "Đăng nhập không thành công! kiểm tra lại email hoặc password",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };

    return (
        <div className='login-page' style={{ padding: '50px' }}>
            <h3 style={{ textAlign: 'center' }}>Đăng nhập</h3>
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

                <Form.Item wrapperCol={{ offset: 1, span: 16 }}>
                    <Button type="primary" htmlType="submit" loading={isSubmit}>
                        Login
                    </Button>
                </Form.Item>
                <Divider>Or</Divider>
                            <p className="text text-normal">Chưa có tài khoản ?
                                <span>
                                    <Link to='/register' > Đăng Ký </Link>
                                </span>
                            </p>
            </Form>
        </div>
    )
}

export default LoginPage