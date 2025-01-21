import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Images/logo2.png';
function Dashboard() {
    return ( 
        <>
        <h1 className="text-center">
            <img className='logoondashboard' src={logo} alt="" /><br />
            Dashboard <br /><br />
            <Link to="/admin/employees/registered-users"><button className='defaultbtn'><h5>Yangi ro`yxatdan o`tganlarni saralash</h5></button></Link>
        </h1>
        </>
     );
}

export default Dashboard;