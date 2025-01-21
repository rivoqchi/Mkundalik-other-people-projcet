import React from 'react';
import {Link} from 'react-router-dom';
function NotAllowed() {
    
    
    return ( 
        <>
        <div className='text-center page404 m-5'>
            <h1 className='h22'><b>403</b></h1>
            <h3><i className="fa-solid fa-triangle-exclamation i404"></i> Ta'qiq</h3>
            <p>Kirish taqiqlanadi!</p>
            <Link to="/login"><button className='defaultbutton'>Kirish</button></Link><br /><br />
            <Link to="/"><button className='defaultbutton'>Bosh sahifaga</button></Link>
        </div>
        </>
     );
}

export default NotAllowed;