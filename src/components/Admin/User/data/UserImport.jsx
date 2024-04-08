import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload, notification } from 'antd';
import { Modal, Table } from 'antd';
const { Dragger } = Upload;
import * as XLSX from "xlsx";
import { callBulkCreateUser } from '../../../../services/api';
import templateFile from './upload_File.xlsx?url';
const UserImport = (props) => {
    const { OpenModalImport, setOpenModalImport } = props;
    // const { Dragger } = Upload;
    const [isSubmit, setIsSubmit] = useState(false);
    const [dataExcel, setDataExcel] = useState([]);
    // const [form] = Form.useForm();
    const dumyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 2000);
    };

    const propsUpload = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: "CSV files (.csv), Excel Files 97-2003 (.xls), Excel Files 2007+(.xlsx)",
        // action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        customRequest: dumyRequest,
        onChange(info) {
            // console.log("Check info>>>", info);
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj;
                    const reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    reader.onload = function (e) {
                        const data = new Uint8Array(reader.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        // find the name of your sheet in the workbook first
                        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

                        // convert to json format
                        const json = XLSX.utils.sheet_to_json(worksheet, {
                            header: ["fullName", "email", "phone"],
                            range: 1 //skip header now
                        });
                        if (json && json.length > 0) setDataExcel(json);
                    };
                }
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleSubmit = async () => {
        const data = dataExcel.map(item => {
            item.password = '123456';
            return item;
        })
        const res = await callBulkCreateUser(data);
        if (res.data) {
            notification.success({
                description: `Success: ${res.data.countSuccess}, Error: ${res.data.countError}`,
                message: "Upload thành công",
            })
            setDataExcel([]);
            setOpenModalImport(false);
            props.fetchUser();
        } else {
            notification.error({
                description: res.message,
                message: "Đã có lỗi xảy ra",
            })
        }
    }
    return (
        <>
            <Modal title="Import data user"
                open={OpenModalImport}
                onOk={() => handleSubmit()}
                width={"50vw"}
                onCancel={() => {
                    setOpenModalImport(false);
                    setDataExcel([])
                }}
                onText={"Import Data"}
                okButtonProps={{
                    disabled: dataExcel.length < 1
                }}
                maskClosable={false}
            >

                <Dragger {...propsUpload}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                        banned files. &nbsp; <a onClick={e => e.stopPropagation()} href={templateFile} download>Download Sample File</a>
                    </p>
                </Dragger>
                <div style={{ paddingTop: 20 }}>
                    <Table
                        dataSource={dataExcel}
                        title={() => <span>Dữ liệu upload:</span>}
                        columns={[
                            { dataIndex: 'fullName', title: 'Tên hiển thị' },
                            { dataIndex: 'email', title: 'Email' },
                            { dataIndex: 'phone', title: 'Số điện thoại' },
                        ]}
                    />
                </div>
            </Modal >
        </>
    )
}

export default UserImport