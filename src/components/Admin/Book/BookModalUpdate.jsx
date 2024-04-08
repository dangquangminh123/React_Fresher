import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Form, Input, Divider, Modal, InputNumber, notification, message, Select, Upload, Row, Col } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { callFetchCategory, callUploadBookImg, callUpdateBook } from '../../../services/api';

const BookModalUpdate = (props) => {
  const [form] = Form.useForm();
  const { OpenBookUpdate, bookUpdate, setBookUpdate, setOpenBookUpdate } = props;
  const [isSubmit, setIsSubmit] = useState(false);
  const [Loading, setLoading] = useState(false);

  const [listCategory, setListCategory] = useState([]);


  const [initForm, setInitForm] = useState(null);
  const [loadingSlider, setLoadingSlider] = useState(false);
  const [DataThumbnail, setDataThumbnail] = useState([]);

  const [DataSlider, setDataSlider] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  useEffect(() => {
    if (bookUpdate?._id) {
      const arrThumbnail = [
        {
          uid: uuidv4(),
          name: bookUpdate.thumbnail,
          status: 'done',
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${bookUpdate.thumbnail}`,
        }
      ]

      const arrSlider = bookUpdate?.slider?.map(item => {
        return {
          uid: uuidv4(),
          name: item,
          status: 'done',
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
        }
      })

      const init = {
        _id: bookUpdate._id,
        mainText: bookUpdate.mainText,
        author: bookUpdate.author,
        price: bookUpdate.price,
        category: bookUpdate.category,
        quantity: bookUpdate.quantity,
        sold: bookUpdate.sold,
        // fileList là trường file do antd nó lưu như vậy
        thumbnail: { fileList: arrThumbnail },
        slider: { fileList: arrSlider },
      }
      setInitForm(init);
      setDataThumbnail(arrThumbnail);
      setDataSlider(arrSlider);
      form.setFieldValue(init);
    }
    return () => {
      form.resetFields();
    }
  }, [bookUpdate])

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleChange = (info, type) => {
    if (info.file.status === 'uploading') {
      type ? setLoadingSlider(true) : setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (url) => {
        type ? setLoadingSlider(false) : setLoading(false);
        setImageUrl(url);
      });
    }
  }

  const handleUpLoadFileThumbnail = async ({ file, onSuccess, onError }) => {
    const res = await callUploadBookImg(file);
    if (res && res.data) {
      setDataThumbnail([{
        name: res.data.fileUploaded,
        uid: file.uid
      }])
      onSuccess('ok')
    } else {
      onError('Đã có lỗi khi upload file');
    }
  };

  const handleUpLoadFileSlider = async ({ file, onSuccess, onError }) => {
    const res = await callUploadBookImg(file);
    if (res && res.data) {
      // Clone state cũ của DataSlider, phải clone vì nếu không clone thì state chỉ lưu có 1 cái ảnh, nên phải clone từ state cũ ra 
      setDataSlider((DataSlider) => [...DataSlider, {
        name: res.data.fileUploaded,
        uid: file.uid
      }])
      onSuccess('ok');
    } else {
      onError('Đã có lỗi khi upload loạt silde ảnh');
    }
  }

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  // const handleUpLoadFile = ({ file, onSuccess, onError }) => {
  //   setTimeout(() => {
  //     onSuccess("ok");
  //   }, 1000);
  // };
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (file.url && !file.originFileObj) {
      setPreviewImage(file.url);
      setPreviewOpen(true);
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
      return;
    }
    getBase64(file.originFileObj, (url) => {
      setPreviewImage(url);
      setPreviewOpen(true);
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    });
  };

  const handleRemoveFile = (file, type) => {
    if (type === 'thumbnail') {
      setDataThumbnail([]);
    }
    if (type === 'slider') {
      const newSlider = DataSlider.filter(x => x.uid !== file.uid);
      setDataSlider(newSlider);
    }
  }

  const onFinish = async (values) => {
    if (DataThumbnail.length === 0) {
      notification.error({
        message: 'Lỗi validate',
        description: 'Vui lòng upload ảnh thumbnail'
      })
      return;
    }

    if (DataSlider.length === 0) {
      notification.error({
        message: 'Lỗi validate',
        description: 'Vui lòng upload ảnh slider'
      })
      return;
    }

    const { _id, mainText, author, price, sold, quantity, category } = values;
    const thumbnail = DataThumbnail[0].name;
    const slider = DataSlider.map(item => item.name);
    setIsSubmit(true);
    const res = await callUpdateBook(_id, thumbnail, slider, mainText, author, price, sold, quantity, category);
    if (res && res.data) {
      message.success('Tạo mới book thành công');
      form.resetFields();
      setDataSlider([]);
      setDataThumbnail([]);
      setInitForm(null);
      setOpenBookUpdate(false);
      await props.fetchbook()
    } else {
      notification.error({
        message: 'Tạo mới book thành công',
        description: res.message
      })
    }
  }
  return (
    <>
      <Modal title="Cập nhập Book" open={OpenBookUpdate} onOk={() => { form.submit() }}
        onCancel={() => {
          form.resetFields();
          setOpenBookUpdate(false);
          setBookUpdate(null)
          setInitForm(null)
        }}
        onText={"Cập nhập"}
        cancelText={"Hủy"}
        confirmLoading={isSubmit}
        width={"50vw"}
        //do not close when click fetchBook
        maskClosable={false}
      >
        <Divider />
        <Form
          form={form}
          name="basic"
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete='off'
        >
          <Row gutter={15}>
            <Col hidden>
              <Form.Item
                hidden
                labelCol={{ span: 24 }}
                label="Id"
                name="_id"

              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tên sách"
                name="mainText"
                rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tác giả"
                name="author"
                rules={[{ required: true, message: 'Vui lòng nhập tác giả!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Giá tiền"
                name="price"
                rules={[{ required: true, message: 'Vui lòng nhập giá tiền sản phẩm!' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  addonAfter="VNĐ"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Thể loại"
                name="category"
                rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}
              >
                <Select
                  defaultValue={null}
                  showSearch
                  allowClear
                  options={listCategory}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Số lượng"
                name="quantity"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng sản phẩm!' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Đã bán"
                name="sold"
                initialValue={0}
                rules={[{ required: true, message: 'Vui lòng nhập số lượng đã bán!' }]}
              >
                <InputNumber min={0} defaultValue={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Ảnh thumbnail"
                name="thumbnail"
              >
                <Upload
                  name='thumbnail'
                  listType='picture-card'
                  className='avatar-uploader'
                  maxCount={1}
                  multiple={false}
                  customRequest={handleUpLoadFileThumbnail}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  onRemove={(file) => handleRemoveFile(file, "thumbnail")}
                  onPreview={handlePreview}
                  // fileList là hình ảnh đó được cố định, mình ko thể sửa nó được, còn defaultFileList là ảnh mặc định sẵn có thể xóa hoặc đổi
                  defaultFileList={initForm?.thumbnail?.fileList ?? []}
                >
                  <div>
                    {Loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Ảnh Slider"
                name="slider"
              >
                <Upload
                  multiple
                  name='slider'
                  listType='picture-card'
                  className='avatar-uploader'
                  customRequest={handleUpLoadFileSlider}
                  beforeUpload={beforeUpload}
                  onChange={(info) => handleChange(info, 'slider')}
                  onRemove={(file) => handleRemoveFile(file, "slider")}
                  onPreview={handlePreview}
                  defaultFileList={initForm?.slider?.fileList ?? []}
                >
                  <div>
                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
    </>
  )
}

export default BookModalUpdate