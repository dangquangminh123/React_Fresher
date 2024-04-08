import React, { useState } from 'react';
import { Button, Drawer, Radio, Space, Descriptions, Badge } from 'antd';
import moment from 'moment';
const UserViewDetail = (props) => {
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState('right');
    const { dataViewDetail, openViewDetail, setOpenViewDetail } = props;
    const showDrawer = () => {
        setOpenViewDetail(true);
    };
    const onClose = () => {
        setOpenViewDetail(false);
    };
    const onChange = (e) => {
        setPlacement(e.target.value);
    };
    return (
        <>
            <Drawer
                title="Xem chi tiết"
                placement={placement}
                closable={false}
                onClose={onClose}
                key={placement}
                width={"50vw"}
                open={openViewDetail}
            >
                <Descriptions
                    title="Thông tin user"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Id">{dataViewDetail._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên hiển thị">{dataViewDetail?.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataViewDetail?.email}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{dataViewDetail?.phone}</Descriptions.Item>

                    <Descriptions.Item label="Role" span={2}>
                        <Badge status="processing" text={dataViewDetail?.role} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {moment(dataViewDetail?.createAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {moment(dataViewDetail?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    );
};
export default UserViewDetail;