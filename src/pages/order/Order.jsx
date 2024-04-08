import { Col, Divider, InputNumber, Row, Empty, Steps, Button, Result } from 'antd';
import './order.scss';
import { DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { doUpdateCartAction } from '../../redux/order/orderSlice';
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import Payment from '../../components/Order/Payment';
import { useNavigate } from 'react-router';
import ViewOrder from '../../components/Order/ViewOrder';
const OrderPage = (props) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const carts = useSelector(state => state.order.carts);
  const navigate = useNavigate();
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
  return (
    <div style={{ background: '#efefef', padding: "20px 0" }}>
      <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
        <div className="order-steps">
          <Steps
            size="small"
            current={currentStep}
            status={"finish"}
            items={[
              {
                title: 'Đơn hàng',
                status: 'Finished',
                icon: <UserOutlined />,
              },
              {
                title: 'Đặt hàng',
                status: 'In Progress',
                icon: <SolutionOutlined />,
              },
              {
                title: 'Thanh toán',
                status: 'wait',
                icon: <SmileOutlined />,
              },
            ]}
          />
        </div>
        {currentStep === 0 &&
          <ViewOrder setCurrentStep={setCurrentStep} />
        }
        {currentStep === 1 &&
          <Payment setCurrentStep={setCurrentStep} />
        }
        {currentStep === 2 &&
          <Result
            icon={<SmileOutlined />}
            title="Đơn hàng đã được đặt thành công!"
            extra={<Button type="primary" onClick={() => navigate('/history')}>Xem lịch sử</Button>}
          />
        }

      </div>
    </div>
  )
}

export default OrderPage;