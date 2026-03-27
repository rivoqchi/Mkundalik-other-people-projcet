import React from 'react';
import image from '../Images/trainer.png';
import AiMotivation from '../Additional/AiMotivation';

function Dashboard() {
  return ( 
    <div className="def-page text-center">
      <div className="dashlogo mb-3">
        <img src={image} alt="" />
      </div>
      <h1 className="mb-4">
        Sport murabbiysi profili
      </h1>
      <div className="row justify-content-center">
          <div className="col-md-8">
              <AiMotivation />
          </div>
      </div>
    </div>
  );
}

export default Dashboard;
