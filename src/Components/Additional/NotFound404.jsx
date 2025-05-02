import React from 'react';
import {Link} from 'react-router-dom';
function NotFound404() {
    return ( 
        <>
            <div className="page404 align-items-center   text-center">
                <h1 className='h1404 pt-5'><b>404</b></h1>
                <h3><i className="fa-solid fa-triangle-exclamation i404"></i> Sahifa topilmadi</h3>
                <p>Siz izlayotgan sahifa mavjud emas!</p>
                <Link to="/"><button className='defaultbutton'>Bosh sahifaga</button></Link><br /><br />
            </div>
        </>
     );
}

export default NotFound404;