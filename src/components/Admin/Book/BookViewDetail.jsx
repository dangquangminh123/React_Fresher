import React, { useState, useEffect } from 'react'
import { Badge, Descriptions, Divider, Drawer, Modal, Upload } from "antd";
// import { FORMAT_DATE_DISPLAY } from "../../../utils/constant";
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
const BookViewDetail = (props) => {
  const { openBookDetail, setOpenBookDetail, dataBookDetail, setDataBookDetail } = props;
  const onClose = () => {
    setOpenBookDetail(false);
    setDataBookDetail(null);
  }

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-2',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-3',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-4',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }
  ]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || (file.preview));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  }

  useEffect(() => {
    if (dataBookDetail) {
      let imgThumbnail = {}, imgSlider = [];
      if (dataBookDetail.thumbnail) {
        imgThumbnail = {
          uid: uuidv4(),
          name: dataBookDetail.thumbnail,
          status: 'done',
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataBookDetail.thumbnail}`,
        }
      }
      if (dataBookDetail.slider && dataBookDetail.slider.length > 0) {
        dataBookDetail.slider.map(item => {
          imgSlider.push({
            uid: uuidv4(),
            name: item,
            status: 'done',
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          })
        })
      }
      setFileList([imgThumbnail, ...imgSlider]);
    }
  }, [dataBookDetail])

  return (
    <>
      <Drawer
        title="Chức năng xem chi tiết"
        width={"50vw"}
        onClose={onClose}
        open={dataBookDetail}
      >
        <Descriptions
          title="Thông tin Book"
          bordered
          column={2}
        >
          <Descriptions.Item label="Id">{dataBookDetail?._id}</Descriptions.Item>
          <Descriptions.Item label="Tên sách">{dataBookDetail?.mainText}</Descriptions.Item>
          <Descriptions.Item label="Tác giả">{dataBookDetail?.author}</Descriptions.Item>
          <Descriptions.Item label="Giá tiền">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataBookDetail?.price ?? 0)}</Descriptions.Item>

          <Descriptions.Item label="Thể loại" span={2}>
            <Badge status="processing" text={dataBookDetail?.category} />
          </Descriptions.Item>

          <Descriptions.Item label="Created At">
            {moment(dataBookDetail?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {moment(dataBookDetail?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
          </Descriptions.Item>
        </Descriptions>
        <Divider orientation="left" > Ảnh Books </Divider>
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          showUploadList={
            { showRemoveIcon: false }
          }
        >

        </Upload>
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Drawer>
    </>
  )
}

export default BookViewDetail