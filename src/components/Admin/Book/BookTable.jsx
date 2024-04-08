import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Row, theme, Table, message, Popconfirm, notification } from 'antd';
import { CgExport } from "react-icons/cg";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import BookCreateModal from './BookCreateModal';
import { AiOutlineReload } from "react-icons/ai";
import { callDeleteBook, callFetchListBook } from '../../../services/api';
import * as XLSX from "xlsx";
import { MdOutlineEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import InputSearchBox from './InputSearchBox';
import BookViewDetail from './BookViewDetail';
import BookModalUpdate from './BookModalUpdate';
const BookTable = () => {
  const [listBook, setListBook] = useState([]);
  const [current, setCurrent] = useState(1);
  const [bookUpdate, setBookUpdate] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [OpenBookCreate, setOpenBookCreate] = useState(false);
  const [OpenBookUpdate, setOpenBookUpdate] = useState(false);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
  const [openBookDetail, setOpenBookDetail] = useState(false);
  const [dataBookDetail, setDataBookDetail] = useState("");

  const fetchbook = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }

    if (sortQuery) {
      query += `&${sortQuery}`;
    }

    const res = await callFetchListBook(query);
    // console.log(res);
    if (res && res.data) {
      setListBook(res.data.result);

      setPageSize(pageSize);
      setCurrent(current);
      setTotal(res.data.meta.total)
    }
    setIsLoading(false);
  }

  const columns = [
    {
      title: 'Id',
      dataIndex: '_id',
      render: (text, record, index) => {
        return (
          <a href='#' onClick={() => {
            setDataBookDetail(record);
            setOpenBookDetail(true);
          }}>{record._id}</a>
        )
      }
    },
    {
      title: 'Tên sách',
      dataIndex: 'mainText',
      sorter: true,
    },
    {
      title: 'Thể loại',
      dataIndex: 'category',
      sorter: true,
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      sorter: true
    },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
      sorter: true
    },
    {
      title: 'Ngày cập nhập',
      dataIndex: 'updatedAt',
      sorter: true
    },
    {
      title: 'Action',
      render: (text, record, index) => {
        return (
          <>
            <Popconfirm
              placement='leftTop'
              title={"Xác nhận xóa Book"}
              description={"Bạn có chắc chắn muốn xóa Cuốn sách này"}
              onConfirm={() => handleDeleteBook(record._id)}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <span style={{ cursor: "pointer", margin: "0px 20px" }}>
                <MdDelete color='#ff4d4f' />
              </span>
            </Popconfirm>

            <MdOutlineEdit
              color='#f57800' style={{ cursor: "pointer" }}
              onClick={() => {
                setOpenBookUpdate(true);
                setBookUpdate(record);
              }}
              fetchbook={fetchbook}
            />
          </>
        )
      }
    },
  ];

  useEffect(() => {
    fetchbook();
  }, [current, pageSize, filter, sortQuery]);



  const handleExportData = () => {
    if (listBook.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(listBook);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "ExportBook.csv");
    }
  }

  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current)
    }

    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize)
      setCurrent(1);
    }
    if (sorter && sorter.field) {
      const q = sorter.order === 'ascend' ? `sort=${sorter.field}` : `sort=-${sorter.field}`
      setSortQuery(q);
    }
  };

  const handleCreateData = () => {
    setOpenBookCreate(true);
  }

  const handleDeleteBook = async (bookId) => {
    const res = await callDeleteBook(bookId);
    if (res && res.data) {
      message.success('Xóa Book thành công');
      fetchbook();
    } else {
      notification.error({
        message: "Có lỗi xảy ra! Xóa Book không thành công",
        description: res.message
      });
    }
  };



  const renderBookHeader = () => {
    return (
      <div className='' style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Table List Book</span>
        <span style={{ display: 'flex', gap: 15 }}>
          <Button
            icon={<CgExport />}
            type="primary"
            onClick={() => handleExportData()}
          >Export</Button>


          <Button
            icon={<FaPlus style={{ marginRight: 10 }} />}
            type="primary"
            onClick={() => handleCreateData()}
          >Thêm mới</Button>

          <Button type='ghost' onClick={() => {
            setFilter("")
            setSortQuery("")
          }}>
            <AiOutlineReload />
          </Button>
        </span>

        <BookCreateModal
          OpenBookCreate={OpenBookCreate}
          setOpenBookCreate={setOpenBookCreate}
          fetchbook={fetchbook}
        />
      </div>
    )
  }

  const bookSearch = (query) => {
    fetchbook(query);
  }

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <InputSearchBox bookSearch={bookSearch} />
        </Col>

        <Col span={24}>
          <Table
            title={renderBookHeader}
            className='def'
            columns={columns}
            dataSource={listBook}
            onChange={onChange}
            loading={isLoading}
            rowKey="_id"
            pagination={
              {
                current: current,
                pageSize: pageSize,
                showSizeChanger: true,
                total: total,
                showTotal: (total, range) => {
                  console.log(">>> rune herre", total, range)
                  return (<div>{range[0]}-{range[1]} trên {total} rows</div>)
                }

              }
            }
          />
        </Col>
      </Row>

      <BookViewDetail
        openBookDetail={openBookDetail}
        setOpenBookDetail={setOpenBookDetail}
        dataBookDetail={dataBookDetail}
        setDataBookDetail={setDataBookDetail}
      />

      <BookModalUpdate
        OpenBookUpdate={OpenBookUpdate}
        bookUpdate={bookUpdate}
        setBookUpdate={setBookUpdate}
        setOpenBookUpdate={setOpenBookUpdate}
        fetchbook={fetchbook}
      />

    </>
  )
}

export default BookTable