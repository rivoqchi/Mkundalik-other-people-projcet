import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchRole } from '../Auth/CheckAuth';
import { useNavigate } from 'react-router-dom';

function IamNew() {
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
          const data = await fetchRole();
              if (!data === "new") {
            navigate('/');
          }
        };
    
        fetchData();
      }, [navigate]);
    return ( 
        <>
        <h3 className="text-center m-4">Tez orada sizni tasdiqlashadi!</h3>
        <div className='text-center page404 m-5'>
            <h1 className='h22'><b>403</b></h1>
            <h3><i className="fa-solid fa-triangle-exclamation i404"></i> Kuting!</h3>
            <p>Tasdiqlashni kuting...</p>
            <Link to="/"><button className='defaultbutton'>Bosh sahifaga</button></Link>
        </div>
        </>
     );
}

export default IamNew;