import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Komissiya() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/commission/dashboard');
    }, [navigate]);

    return (
        <>
            Redirecting...
        </>
    );
}

export default Komissiya;