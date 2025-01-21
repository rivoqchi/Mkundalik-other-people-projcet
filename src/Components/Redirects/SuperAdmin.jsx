import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SuperAdmin() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/superadmin/dashboard');
    }, [navigate]);

    return (
        <>
            Redirecting...
        </>
    );
}

export default SuperAdmin;