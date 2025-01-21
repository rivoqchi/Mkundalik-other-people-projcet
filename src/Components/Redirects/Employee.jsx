import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Employee() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/user/dashboard');
    }, [navigate]);

    return (
        <>
            Redirecting...
        </>
    );
}

export default Employee;