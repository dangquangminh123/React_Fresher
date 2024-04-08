import { Col, Divider, InputNumber, Row, Empty, Steps, Button, Result } from 'antd';
import './Vieworder.scss';
import { useDispatch, useSelector } from 'react-redux';
import OrderPage from '../../pages/order/Order';
import { doUpdateCartAction, doDeleteItemCartAction } from '../../redux/order/orderSlice';
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
const ViewOrder = (props) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
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

  const handleOnChangeInput = (value, book) => {
    if (!value || value < 1) return;
    if (!isNaN(value)) {
      dispatch(doUpdateCartAction({ quantity: value, detail: book, _id: book._id }))
    }
  }

  const OnBuyNow = async (values) => {
    props.setCurrentStep(1);
  }
  return (
    <div style={{ background: '#efefef', padding: "20px 0" }}>
      <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
        <Row gutter={[20, 20]}>
          <Col md={18} xs={24}>
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
                      <InputNumber onChange={(value) => handleOnChangeInput(value, book)} value={book.quantity} />
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
            {carts.length === 0 &&
              <div className='order-book-empty'>
                <Empty
                  description={"Không có bất kì sản phẩm nào trong giỏ hàng!"}
                />
              </div>
            }
          </Col>
          <Col md={6} xs={24} >
            <div className='order-sum'>
              <div className='calculate'>
                <span>  Tạm tính</span>
                <span> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}</span>
              </div>
              <Divider style={{ margin: "10px 0" }} />
              <div className='calculate'>
                <span> Tổng tiền</span>
                <span className='sum-final'>  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)} ₫</span>
              </div>
              <Divider style={{ margin: "10px 0" }} />
              <button onClick={() => OnBuyNow()}>Mua Hàng ({carts?.length ?? 0})</button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default ViewOrder;