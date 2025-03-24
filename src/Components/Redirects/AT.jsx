import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AT() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/at/dashboard');
    }, [navigate]);

    return (
        <>
            Redirecting...
        </>
    );
}

export default AT;