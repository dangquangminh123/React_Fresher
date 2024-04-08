import React, { useState, useEffect } from 'react';
import { Button, Empty, Form, Input, Divider, Modal, InputNumber, notification, message, Col, Row, Radio } from 'antd';
import { LoadingOutlined, DeleteOutlined } from '@ant-design/icons';
import { callPlaceOrder } from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { doPlaceOrderAction } from '../../redux/order/orderSlice';
const Payment = (props) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const { TextArea } = Input;
  const user = useSelector(state => state.account.user);
  const carts = useSelector(state => state.order.carts);
  const dispatch = useDispatch();

  useEffect(() => {
    if (carts && carts.length > 0) {
      let sum = 0;
      carts.map(item => {
        sum += item.quantity * item.detail.price;
      })
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, [carts]);

  const onFinish = async (values) => {
    setIsSubmit(true);
    const detailOrder = carts.map(item => {
      return {
        bookName: item.detail.mainText,
        quantity: item.quantity,
        _id: item._id
      }
    })
    const data = {
      name: values.name,
      address: values.address,
      phone: values.phone,
      totalPrice: totalPrice,
      detail: detailOrder
    }

    const res = await callPlaceOrder(data);
    if (res && res.data) {
      message.success('Đặt hàng thành công !');
      dispatch(doPlaceOrderAction());
      props.setCurrentStep(2);
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message
      })
    }
    setIsSubmit(false);
  }
  return (
    <>
      <div style={{ background: '#efefef', padding: "20px 0" }}>
        <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
          <Row gutter={[20, 20]}>
            <Col md={16} xs={24}>
              {carts?.map((book, index) => {
                const currentBookPrice = book?.detail?.price ?? 0;
                return (
                  <div className='order-book'>
                    <div className='book-content'>
                      <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`} />
                      <div className='title'>
                        {book?.detail?.mainText}
                      </div>
                      <div className='price'>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book?.detail?.price ?? 0)}
                      </div>
                    </div>
                    <div className='action'>
                      <div className='quantity'>
                        {book.quantity}
                      </div>
                      <div className='sum'>
                        Tổng:  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice * book.quantity ?? 0)}
                      </div>
                      <DeleteOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => dispatch(doDeleteItemCartAction({ _id: book._id }))}
                        color='#eb2f96'
                      />
                    </div>
                  </div>
                )
              })}
            </Col>
            <Col md={8} xs={24}>
              <div className='order-sum'>
                <Form
                  onFinish={onFinish}
                  form={form}
                >
                  <Form.Item style={{ margin: 0 }} labelCol={{ span: 24 }}
                    label="Tên người nhận" name="name" initialValue={user?.fullName}
                    rules={[{ required: true, message: 'Tên người nhận không được để trống' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    style={{ margin: 0 }}
                    labelCol={{ span: 24 }}
                    label="Số điện thoại"
                    name="phone"
                    initialValue={user?.phone}
                    rules={[{ required: true, message: 'Không được để trống số điện thoại!' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    style={{ margin: 0 }}
                    labelCol={{ span: 24 }}
                    label="Địa chỉ"
                    name="address"
                    rules={[{ required: true, message: 'Địa chỉ nhận hàng không được để trống!' }]}
                  >
                    <TextArea autoFocus rows={4} />
                  </Form.Item>
                </Form>
                <div className='info'>
                  <div className='method'>
                    <div>Hình thức thanh toán</div>
                    <Radio checked>Thanh toán khi nhận hàng!</Radio>
                  </div>
                </div>
                <Divider style={{ margin: "5px 0" }} />
                <div className='calculate'>
                  <span> Tổng tiền</span>
                  <span className='sum-final'>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)} ₫</span>
                </div>
                <Divider style={{ margin: "5px 0" }} />
                <button onClick={() => form.submit()} disabled={isSubmit}>
                  {isSubmit && <span><LoadingOutlined /> &nbsp;</span>}
                  Đặt Hàng ({carts?.length ?? 0})
                </button>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Payment