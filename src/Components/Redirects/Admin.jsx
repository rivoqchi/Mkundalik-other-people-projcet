import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/admin/dashboard');
    }, [navigate]);

    return (
        <>
            Redirecting...
        </>
    );
}

export default Admin;