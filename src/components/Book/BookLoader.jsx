import React, {useState } from 'react'
import { Col, Row, Skeleton } from 'antd';
const BookLoader = () => {
    const [active, setActive] = useState(false);
    const [block, setBlock] = useState(false);
    const [size, setSize] = useState('default');
    return (
        <Row gutter={[20, 20]}>
            <Col md={10} sm={0} xs={0}>
                <Skeleton.Input active={true} block={true} style={{ width: '100%', height: 350 }} />
                <div style={{ display: "flex", gap: 20, marginTop: 20, overflow: 'hidden' }}>
                    <Skeleton.Image active={true} size={10} />
                    <Skeleton.Image active={true} />
                    <Skeleton.Image active={true} />
                </div>
            </Col>
            <Col md={14} sm={24}>
                <Skeleton.Image paragraph={{ rows: 3 }} active={true} /> <br /><br />
                <Skeleton.Image paragraph={{ rows: 2 }} active={true} /><br /><br />

                <div style={{ display: "flex", gap: 20, marginTop: 20, overflow: 'hidden' }}>
                    <Skeleton.Button active={active} style={{ width: 100 }} />
                    <Skeleton.Button active={active} style={{ width: 100 }} />
                    {/* <Skeleton.Button active={active} style={{ width: 200 }} /> */}
                </div>
            </Col>
        </Row>
    )
}

export default BookLoader