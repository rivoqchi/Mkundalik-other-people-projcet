import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
function Xodimlar() {

    return ( 
        <>
        <div className="text-center xodimlarbuttons">
            <Link to="/superadmin/employees/adduser"><button className="xodimlarbtn"><i className="fa-solid fa-plus"></i> Yangi xodim yaratish</button></Link><br />
            <Link to="/superadmin/employees/allusers"><button className="xodimlarbtn"><i className="fa-solid fa-user-group"></i> Barcha xodimlar ma'lumotlari</button></Link><br />
            <Link to="/superadmin/employees/registered-users"><button className="xodimlarbtn"><i className="fa-solid fa-filter"></i> Yangi ro`yxatdan o`tganlarni saralash</button></Link>
        </div>


        </>
     );
}

export default Xodimlar;