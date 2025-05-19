import React from 'react';
import image from '../Images/trainer.png';

function Dashboard() {
  return ( 
    <>
      <div className="dashlogo">
        <img src={image} alt="" />
      </div>
      <h1 className="text-center mh100">
        Sport murabbiysi profili
      </h1>
    </>
  );
}

export default Dashboard;
