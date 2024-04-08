import React, { useEffect, useState } from 'react';
import './Home.scss';
import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Rate, Tabs, Divider, InputNumber, Pagination, Checkbox, Row, Spin, } from 'antd';
import { callFetchCategory, callFetchListBook } from '../../services/api';
import { useNavigate, useOutletContext } from 'react-router-dom';
const Home = () => {
  // Dùng hook useOutlet của react-router-dom để lấy dữ liệu được truyền từ component header 
  const [searchTerm, setSearchTerm] = useOutletContext();
  const [form] = Form.useForm();
  const [listCategory, setListCategory] = useState([]);
  const [listBook, setListBook] = useState([]);
  const [current, setCurrent] = useState(1);
  const [sortQuery, setSortQuery] = useState("sort=-sold");
  const [pageSize, setPageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const initCategory = async () => {
      const res = await callFetchCategory();
      if (res && res.data) {
        const d = res.data.map(item => {
          return { label: item, value: item }
        })
        setListCategory(d);
      }
    }
    initCategory();
  }, []);

  useEffect(() => {
    fetchbook();
  }, [current, pageSize, filter, sortQuery, searchTerm]);

  const handleChangeFilter = (changedValues, values) => {
    // console.log(">>> check handleChangeFilter", changedValues, values)
    if (changedValues.category) {
      const cate = values.category;
      if (cate && cate.length > 0) {
        // nối hàng loạt các mảng array của cate thành chuỗi bằng cách dùng hàm join
        const f = cate.join(',');
        setFilter(`category=${f}`);
      } else {
        setFilter('');
      }
    }
  }

  const handleOnchangePage = (pagination) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current)
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1)
    }
  }
  const fetchbook = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }

    if (searchTerm) {
      query += `&mainText=/${searchTerm}/i`;
    }
    const res = await callFetchListBook(query);
    console.log(res);
    if (res && res.data) {
      setListBook(res.data.result);
      // setPageSize(pageSize);
      // setCurrent(1);
      setTotal(res.data.meta.total)
    }
    setIsLoading(false);
  }

  const onFinish = (values) => {
    if (values?.range?.from >= 0 && values?.range?.to >= 0) {
      let f = `price>=${values?.range?.from}&price<=${values?.range?.to}`;
      if (values?.category?.length) {
        const cate = values?.category?.join(',');
        f += `&category=${cate}`;
      }
      setFilter(f);
    }
  }

  const onChange = (key) => {
    // console.log(key);
  };

  // const plainOptions = ['Apple', 'Pear', 'Orange'];


  const items = [
    {
      key: 'sort=-sold',
      label: `Phổ biến`,
      children: <></>,
    },
    {
      key: 'sort=-updatedAt',
      label: `Hàng Mới`,
      children: <></>,
    },
    {
      key: 'sort=price',
      label: `Giá Thấp Đến Cao`,
      children: <></>,
    },
    {
      key: 'sort=-price',
      label: `Giá Cao Đến Thấp`,
      children: <></>,
    },
  ];

  const handleRedirectBook = (book) => {
    const slug = convertSlug(book.mainText);
    navigate(`/book/${slug}?id=${book._id}`)
  }

  const nonAccentVietnamese = (str) => {
    str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
  }

  const convertSlug = (str) => {
    str = nonAccentVietnamese(str);
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
    const to = "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

    return str;
  }

  return (
    <div className='homepage-container' style={{ maxWidth: 1440, margin: '0 auto' }}>
      <Row gutter={[20, 20]}>
        <Col md={4} sm={0} xs={0}>
          <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
            <div style={{ display: 'flex', justifyContent: "space-between" }}>
              <span> <FilterTwoTone twoToneColor="#eb2f96" />
              <span style={{ fontWeight: 500 }}> Bộ lọc tìm kiếm</span>
              </span>
              <ReloadOutlined title='Reset' onClick={() => {
                form.resetFields();
                setFilter('');
                setSearchTerm('');
              }}
              />
            </div>
            <Divider />
            <Form form={form}
              onFinish={onFinish}
              onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}>
              <Form.Item
                name="category"
                label="Danh mục sản phẩm"
                labelCol={{ span: 24 }}
              >
                <Checkbox.Group onChange={onChange}>
                  <Row>
                    {listCategory?.map((item, index) => {
                      return (
                        <Col span={24} key={`index-${index}`} style={{ padding: '7px 0px' }}>
                          <Checkbox value={item.value}>
                            {item.label}
                          </Checkbox>
                        </Col>
                      )
                    })}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
              <Divider />
              <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <Form.Item name={["range", 'from']}>
                    <InputNumber name='from' min={0} placeholder='đ Từ' formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                  </Form.Item>
                  <span>-</span>
                  <Form.Item name={["range", 'to']}>
                    <InputNumber name='from' min={0} placeholder='đ Đến' formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                  </Form.Item>
                </div>

                <div>
                  <Button onClick={() => form.submit()} style={{ width: "100%" }} type='primary'>
                    Áp dụng
                  </Button>
                </div>
              </Form.Item>
              <Divider />

              <Form.Item label="Đánh giá" labelCol={{ span: 24 }}>
                <div>
                  <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                  <span className='ant-rate-text'></span>
                </div>
                <div>
                  <Rate value={4} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                  <span className='ant-rate-text'>trở lên:</span>
                </div>
                <div>
                  <Rate value={3} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                  <span className='ant-rate-text'>trở lên</span>
                </div>
                <div>
                  <Rate value={2} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                  <span className='ant-rate-text'>trở lên</span>
                </div>
                <div>
                  <Rate value={1} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                  <span className='ant-rate-text'>trở lên</span>
                </div>
              </Form.Item>
            </Form>
          </div>
        </Col>
        <Col md={20} xs={24} style={{ border: "1px solid red" }}>
          <Spin tip="Loading...." spinning={isLoading}>
            <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
              <Row>
                <Tabs defaultActiveKey="sort=-sold" items={items} onChange={(value) => { setSortQuery(value) }} style={{ overflowX: "auto" }} />
                <Col xs={24} md={0}>
                  <div style={{ marginBottom: 20 }} >
                    <span onClick={() => setShowMobileFilter(true)}>
                      <FilterTwoTone />
                      <span style={{ fontWeight: 500 }}> Lọc</span>
                    </span>
                  </div>
                </Col>
                <br />
              </Row>
              <Row className='customize-row'>
                {listBook?.map((item, index) => {
                  return (
                    <div className='column' key={`book-${index}`} onClick={() => handleRedirectBook(item)}>
                      <div className='wrapper'>
                        <div className='thumbnail'>
                          <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`} alt="thumbnail book" />
                        </div>
                        <div className='text' title={item.mainText}>{item.mainText}</div>
                        <div className='price'>
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(70000)}
                        </div>
                        <div className='rating'>
                          <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                          <span>Đã bán {item.sold}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </Row>
            </div>
          </Spin>
          <Divider />
          <Row style={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              current={current}
              total={total}
              pageSize={pageSize}
              responsive
              onChange={(p, s) => handleOnchangePage({ current: p, pageSize: s })}
            />
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default Home