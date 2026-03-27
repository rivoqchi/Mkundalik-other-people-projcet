import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Images/logo2.png';
import AiMotivation from '../Additional/AiMotivation';
function Dashboard() {
    return ( 
        <div className="def-page text-center">
            <img className='logoondashboard mb-3' src={logo} alt="" /><br />
            <h1 className="mb-4">Dashboard</h1>
            
            <div className="row justify-content-center mb-4">
                <div className="col-md-8">
                    <AiMotivation />
                </div>
            </div>

            <Link to="/user/schedule/new">
                <button className='defaultbtn'><h5>Yangi hisobotga o`tish</h5></button>
            </Link>
        </div>
     );
}

export default Dashboard;