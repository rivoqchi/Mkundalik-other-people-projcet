import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
function Xodimlar() {

    return ( 
        <>
        <div className="text-center xodimlarbuttons">
            <Link to="/complex/employees/allusers"><button className="xodimlarbtn"><i className="fa-solid fa-user-group"></i> Menga biriktirilgan xodimlar</button></Link><br />
        </div>

        </>
     );
}

export default Xodimlar;