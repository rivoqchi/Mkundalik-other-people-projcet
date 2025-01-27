import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Hr() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/hr/dashboard');
    }, [navigate]);

    return (
        <>
            Redirecting...
        </>
    );
}

export default Hr;