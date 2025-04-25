import React from 'react';

function About() {
  return (
    <section className="about" id="about">
      <figure className="about-banner">
        <img src="https://i.postimg.cc/LXcVgTbJ/about-banner.png" alt="A man thinking" className="w-100" />
      </figure>

      <div className="about-content section-content">
        <p className="section-subtitle">About me</p>
        <h2 className="h2 section-title">Need a Product? Get in Touch!</h2>
        <p className="section-text">
          Hi, I'm Jack Reacher. I'm a developer passionate in creating clean web applications with intuitive functionalities. 
          I enjoy the process of turning ideas into reality using creative solutions. I'm always curious about leaning new skills, 
          tools and concepts. In addition to working on various solo full stack projects, I have worked with complex teams, 
          which involves daily stand-ups and communications, source control and project management
        </p>
      </div>

      <div className="btn-group">
        <button className="btn btn-secondary">Hire me</button>
        <button className="btn btn-primary">Download CV</button>
      </div>
    </section>
  );
}

export default About;