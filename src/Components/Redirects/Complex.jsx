import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Complex() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/complex/dashboard');
    }, [navigate]);

    return (
        <>
            Redirecting...
        </>
    );
}

export default Complex;