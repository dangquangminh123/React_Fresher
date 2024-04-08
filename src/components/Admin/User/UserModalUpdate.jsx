import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, Divider, Modal, notification, message } from 'antd';
import { callUpdateUser } from '../../../services/api';

const UserUpdateModal = (props) => {
    const { OpenModalUpdate, setOpenModalUpdate, dataUpdate, setDataUpdate } = props;
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async (values) => {

        const { fullName, _id, phone } = values;
        setIsSubmit(true);
        const res = await callUpdateUser(_id, fullName, phone);
        if (res && res.data) {
            message.success("Cập nhập user thành công");
            setOpenModalUpdate(false);
            await props.fetchuser()
        } else {
            notification.error({
                message: "Đã xảy ra lỗi! đăng ký không thành công",
                description: res.message
            })
        }
        setIsSubmit(false);
    }

    useEffect(() => {
        form.setFieldsValue(dataUpdate)
    }, [dataUpdate])

    return (
        <>
            <Modal title="Updated A User" open={OpenModalUpdate}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    setDataUpdate(null);
                }}
                onText={"Cập nhập"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
            >
                <Divider />
                <Form
                    form={form}
                    name="basic"
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete='off'
                // initialValues={dataUpdate}
                >
                    <Form.Item
                        hidden
                        labelCol={{ span: 24 }}
                        label="Id"
                        name="_id"
                        rules={[{ required: true, message: 'Id không được trống' }]}
                    >
                        <Input />
                    </Form.Item>

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
                        <Input disabled />
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

export default UserUpdateModal