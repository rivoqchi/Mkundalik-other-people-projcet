import React from 'react';
import image from '../Images/hr.png';

function Dashboard() {
  return ( 
    <>
      <div className="dashlogo">
        <img src={image} alt="" />
      </div>
      <h1 className="text-center mh100">
        HR profili
      </h1>
    </>
  );
}

export default Dashboard;