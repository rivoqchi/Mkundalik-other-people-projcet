import React from 'react';
import image from '../Images/hr.png';
import CheckBD from '../CheckBD';

function Dashboard() {
  return ( 
    <>
      <div className="dashlogo">
        <img src={image} alt="" />
      </div>
      <h1 className="text-center mh100">
        HR profili
      </h1>
      <CheckBD />
    </>
  );
}

export default Dashboard;