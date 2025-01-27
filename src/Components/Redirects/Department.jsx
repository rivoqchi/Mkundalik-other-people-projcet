import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Department() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/department/dashboard');
    }, [navigate]);

    return (
        <>
            Redirecting...
        </>
    );
}

export default Department;