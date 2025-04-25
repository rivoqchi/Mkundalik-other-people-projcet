import React, { useState } from 'react';

function Projects() {
  const [showMore, setShowMore] = useState(false);
  
  const projects = [
    {
      id: 1,
      title: "Below the plane",
      date: "March 2025",
      datetime: "2025-03",
      image: "https://i.postimg.cc/SRGFrbyY/image-plane.jpg",
      alt: "Plane flight"
    },
    {
      id: 2,
      title: "Pile of coffee beans",
      date: "February 2025",
      datetime: "2025-03",
      image: "https://i.postimg.cc/3r4jFjjr/coffee.jpg",
      alt: "Ceramic cup filled with coffee"
    },
    {
      id: 3,
      title: "Weathering Arc",
      date: "February 2025",
      datetime: "2025-02",
      image: "https://i.postimg.cc/grFpxQzw/desert.jpg",
      alt: "Natural Rock Arch"
    },
    {
      id: 4,
      title: "Natural light",
      date: "February 2025",
      datetime: "2025-02",
      image: "https://i.postimg.cc/s2mpWxFt/article-3.jpg",
      alt: "Cityscape during sunset"
    },
    {
      id: 5,
      title: "Mixed shades",
      date: "January 2025",
      datetime: "2025-01",
      image: "https://i.postimg.cc/bJCS8cR7/explore-product-4.jpg",
      alt: "Heart-shaped object"
    },
    {
      id: 6,
      title: "Rugged mountains",
      date: "January 2025",
      datetime: "2025-01",
      image: "https://i.postimg.cc/PJgBCFgV/img.jpg",
      alt: "Dark Rock and the White Snow"
    },
    // Additional projects could be added here for "Load More" functionality
  ];

  return (
    <section className="project" id="portfolio">
      <ul className="project-list">
        <li>
          <div className="project-content section-content">
            <p className="section-subtitle">My Works</p>
            <h2 className="h3 section-title">See my works which will amaze you!</h2>
            <p className="section-text">
              We develop the best quality website that serves you in the long-term. Well-documented, clean, 
              easy and elegant interface helps any non-technical clients
            </p>
          </div>
        </li>

        {projects.map(project => (
          <li key={project.id}>
            <a href="#" className="project-card">
              <figure className="card-banner">
                <img src={project.image} alt={project.alt} width="500" />
              </figure>

              <div className="card-content">
                <h3 className="h4 card-title">{project.title}</h3>
                <time className="publish-date" dateTime={project.datetime}>{project.date}</time>
              </div>
            </a>
          </li>
        ))}

        <li>
          <button className="load-more" onClick={() => setShowMore(!showMore)}>
            {showMore ? 'Show Less' : 'Load More Works'}
          </button>
        </li>
      </ul>
    </section>
  );
}

export default Projects;