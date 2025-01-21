import React from 'react';
import {Link} from 'react-router-dom';
function NotFound404() {
    return ( 
        <>
        <div className='text-center page404 m-5'>
            <h1 className='h22'><b>404</b></h1>
            <h3><i className="fa-solid fa-triangle-exclamation i404"></i> Xatolik</h3>
            <p>Sahifa mavjud emas</p>
            <Link to="/"><button className='defaultbutton'>Bosh sahifaga</button></Link>
        </div>
        </>
     );
}

export default NotFound404;