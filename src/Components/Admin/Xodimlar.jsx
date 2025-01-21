import React from 'react';
import {Link} from 'react-router-dom';
function Xodimlar() {
    return ( 
        <>
        <div className="text-center xodimlarbuttons">
            <Link to="/admin/employees/adduser"><button className="xodimlarbtn"><i class="fa-solid fa-plus"></i> Yangi xodim yaratish</button></Link><br />
            <Link to="/admin/employees/registered-users"><button className="xodimlarbtn"><i class="fa-solid fa-filter"></i> Yangi ro`yxatdan o`tganlarni saralash</button></Link>
        </div>
        </>
     );
}

export default Xodimlar;