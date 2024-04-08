import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, Divider, Modal, notification, message} from 'antd';
import { callCreateAUser } from '../../../services/api';

const UserCreateModal = (props) => {
    const { OpenModalCreate, setOpenModalCreate } = props;

    const [isSubmit, setIsSubmit] = useState(false);

    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const { fullName, email, password, phone } = values;
        setIsSubmit(true);
        const res = await callCreateAUser(fullName, email, password, phone);
        if (res && res.data) {
            message.success("Tạo mới user thành công");
            form.resetFields();
            setOpenModalCreate(false);
            await props.fetchuser()
        } else {
            notification.error({
                message: "Đã xảy ra lỗi! đăng ký không thành công",
                description: res.message
            })
        }
        setIsSubmit(false);
    }

    return (
        <>
            {/* <Button type="primary" onClick={showModal}>
                Open Modal
            </Button> */}
            <Modal title="Create New User" open={OpenModalCreate}
                onOk={() => { form.submit() }}
                onCancel={() => setOpenModalCreate(false)}
                onText={"Tạo mới"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
            >
                <Divider />
                <Form
                    form={form}
                    name="basic"
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete='false'
                >
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Họ Và Tên"
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
                </Form>
            </Modal>
        </>
    )
}

export default UserCreateModal