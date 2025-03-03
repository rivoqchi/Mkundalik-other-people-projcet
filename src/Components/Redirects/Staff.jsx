import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Staff() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/staff/dashboard');
    }, [navigate]);

    return (
        <>
            Redirecting...
        </>
    );
}

export default Staff;