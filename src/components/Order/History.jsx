import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactJson from 'react-json-view';
import { historyOrder } from '../../services/api';
import moment from 'moment';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Divider, Row, Tag, Space, Table, Col } from 'antd';

const History = () => {
  const [listOrder, setListOrder] = useState([]);
  const [detailOrder, setDetailOrder] = useState([]);
  
  useEffect(() => {
    const fetchOrder = async () => {

      const res = await historyOrder();
      if (res && res.data) {
        console.log(res.data);
        setListOrder(res.data);
        setDetailOrder(res.data.detail);
      }
    }
    fetchOrder();
  }, []);

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => {
        return (
          <p>{index}</p>
        )
      }
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      render: (text, record, index) => {
        return (
          <p>{moment(record?.createdAt).format('DD-MM-YYYY HH:mm:ss')}</p>
        )
      }
    },
    {
      title: 'Tổng số tiền',
      dataIndex: 'totalPrice',
      render: (item, record, index) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item)
    }
    },
    {
      title: 'Trạng thái',
      render: (_, { tags }) => {
        return (
          <>
            <Tag icon={<CheckCircleOutlined />} color="success">
              Thành công
            </Tag>
          </>
        );
      },
    },
    {
      title: 'Chi tiết',
      key: "action",
      render: (_, record) => {
        return (
          <>
            Chi tiết đơn hàng<ReactJson src={record?.detail} 
            name="Chi tiết đơn mua"
             collapsed={true}
             enableClipboard={false}
             displayDataTypes={false}
             displayObjectSize={false}/>
          </>
        )
      }
    },
  ];
  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Table
            className='def'
            columns={columns}
            dataSource={listOrder}
            rowKey="_id"
          />
        </Col>
      </Row>
    </>
  )
}

export default History