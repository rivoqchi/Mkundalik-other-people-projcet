import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Sport() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/sport/dashboard');
    }, [navigate]);

    return (
        <>
            Redirecting...
        </>
    );
}

export default Sport;