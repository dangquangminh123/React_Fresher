import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';

const NotPermitted = () => {
    const navigate = useNavigate();

    return (
        <>
            <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
                extra={<Button type="primary" key="console" onClick={() => navigate('/')}>
                    Back Home
                </Button>}
            />
        </>
    )
}

export default NotPermitted