import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Row, theme, Table, message, Popconfirm, notification } from 'antd';
import InputSearch from './InputSearch';
import { callFetchListUser } from '../../../services/api';
import { callDeleteUser } from '../../../services/api';
import { AiOutlineReload } from "react-icons/ai";
import UserViewDetail from './UserViewDetail';
import { CgExport } from "react-icons/cg";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import UserCreateModal from './UserCreateModal';
import UserImport from './data/UserImport';
import * as XLSX from "xlsx";
import UserUpdateModal from './UserModalUpdate';
import { MdOutlineEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
// https://stackblitz.com/run?file=demo.tsx
const UserTable = () => {
    const [listUser, setListUser] = useState([]);
    const [current, setCurrent] = useState(1);
    const [dataUpdate, setDataUpdate] = useState("");
    const [pageSize, setPageSize] = useState(2);
    const [isLoading, setIsLoading] = useState(false);
    const [OpenModalCreate, setOpenModalCreate] = useState(false);
    const [OpenModalUpdate, setOpenModalUpdate] = useState(false);
    const [OpenModalImport, setOpenModalImport] = useState(false);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("");
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState("");

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            render: (text, record, index) => {
                return (
                    <a href='#' onClick={() => {
                        setDataViewDetail(record);
                        setOpenViewDetail(true);
                    }}>{record._id}</a>
                )
            }
        },
        {
            title: 'Tên hiển thị',
            dataIndex: 'fullName',
            sorter: true,
        },
        {
            title: 'Địa chỉ Email',
            dataIndex: 'email',
            sorter: true
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            sorter: true
        },
        {
            title: 'Action',
            render: (text, record, index) => {
                return (
                    <>
                        <Popconfirm
                            title={"Xác nhận xóa User"}
                            description={"Bạn có chắc chắn muốn xóa user này"}
                            onConfirm={() => handleDeleteUser(record._id)}
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
                                setOpenModalUpdate(true);
                                setDataUpdate(record);
                            }}
                            fetchuser={fetchuser}
                        />
                    </>
                )
            }
        },
    ];

    useEffect(() => {
        fetchuser();// eric =  null
        //did mount (lần 1)
        // chỉ biến thay đổi là chạy

    }, [current, pageSize, filter, sortQuery]);

    //tức là truyền input đầu vào cho hàm fetchUsser này nè
    //nên tao mới bảo là cách tư duy của mày có vấn đề =))
    // Không biết làm như nào thì có vấn đề rồi anh ạ! :(((())))
    const fetchuser = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }

        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchListUser(query);
        // console.log(res);
        if (res && res.data) {
            setListUser(res.data.result);
            setPageSize(pageSize);
            // setCurrent(1);
            setTotal(res.data.meta.total)
        }
        setIsLoading(false);
    }

    const handleExportData = () => {
        if (listUser.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listUser);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "ExportUser.csv");
        }
    }

    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }

        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            // setCurrent(1);
        }
        if (sorter && sorter.field) {
            const q = sorter.order === 'ascend' ? `sort=${sorter.field}` : `sort=-${sorter.field}`
            setSortQuery(q);
        }
    };

    const handleCreateData = () => {
        setOpenModalCreate(true);
    }

    const handleDeleteUser = async (userId) => {
        const res = await callDeleteUser(userId);
        if (res && res.data) {
            message.success('Xóa user thành công');
            fetchuser();
        } else {
            notification.error({
                message: "Có lỗi xảy ra! Xóa user không thành công",
                description: res.message
            });
        }
    };

    // const handleUpdateData = () => {
    //     setOpenModalUpdate(true);
    // }

    const handleImportData = () => {
        setOpenModalImport(true);
    }

    const renderHeader = () => {
        return (
            <div className='' style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Table List Users</span>
                <span style={{ display: 'flex', gap: 15 }}>
                    <Button
                        icon={<CgExport />}
                        type="primary"
                        onClick={() => handleExportData()}
                    >Export</Button>

                    <Button
                        icon={<IoCloudUploadOutline style={{ marginRight: 10 }} />}
                        type="primary"
                        onClick={() => handleImportData()}
                    >Upload</Button>

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

                <UserCreateModal
                    OpenModalCreate={OpenModalCreate}
                    setOpenModalCreate={setOpenModalCreate}
                    fetchuser={fetchuser}
                />

                <UserImport
                    OpenModalImport={OpenModalImport}
                    setDataUpdate={setDataUpdate}
                    setOpenModalImport={setOpenModalImport}
                    fetchuser={fetchuser}
                />
            </div>
        )
    }

    const handleSearch = (query) => {
        fetchuser(query);
    }

    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <InputSearch handleSearch={handleSearch} />
                </Col>

                <Col span={24}>
                    <Table
                        title={renderHeader}
                        className='def'
                        columns={columns}
                        dataSource={listUser}
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

            <UserViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <UserUpdateModal
                OpenModalUpdate={OpenModalUpdate}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                fetchuser={fetchuser}
            />

        </>
    )
}


export default UserTable;