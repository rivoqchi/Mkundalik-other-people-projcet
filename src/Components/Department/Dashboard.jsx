import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Images/logo2.png';
import CheckBD from '../CheckBD';

function Dashboard() {
    return ( 
        <>
        <h1 className="text-center mh100">
             <img className='logoondashboard' src={logo} alt="" /><br />
             Dashboard <br /><br />
             <Link to="/department/schedule/new"><button className='defaultbtn'><h5>Yangi hisobotga o`tish</h5></button></Link>
         </h1>
            <CheckBD />
        </>
     );
}

export default Dashboard;