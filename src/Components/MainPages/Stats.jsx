import React from 'react';

function Stats() {
  return (
    <section className="stats" id="stats">
      <ul className="stats-list">
        <li>
          <a href="#" className="stats-card">
            <div className="card-icon">
              <img src="https://i.postimg.cc/x1TWtf69/stats-card-icon-1.png" alt="badge icon" />
            </div>

            <h2 className="h2 card-title">12+<strong>Years of Experience</strong></h2>
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </a>
        </li>

        <li>
          <a href="#" className="stats-card">
            <div className="card-icon">
              <img src="https://i.postimg.cc/q7ByNYBb/stats-card-icon-2.png" alt="checkmark icon" />
            </div>

            <h2 className="h2 card-title">230+<strong>Completed Projects</strong></h2>
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </a>
        </li>

        <li>
          <a href="#" className="stats-card">
            <div className="card-icon">
              <img src="https://i.postimg.cc/hj6d3tL6/stats-card-icon-3.png" alt="peoples rating icon" />
            </div>

            <h2 className="h2 card-title">95+<strong>Happy Clients</strong></h2>
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </a>
        </li>
      </ul>
    </section>
  );
}

export default Stats;