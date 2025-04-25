import React from 'react';

function Hero() {
  return (
    <section className="hero" id="home">
      <figure className="hero-banner">
        <picture>
          <source srcSet="https://i.postimg.cc/qgfKBWnD/hero-banner.png" media="(min-width: 768px)" />
          <source srcSet="https://i.postimg.cc/ncZ75fFM/hero-banner-md.png" media="(min-width: 500px)" />
          <img src="https://i.postimg.cc/2yLvDCqB/hero-banner-sm.png" alt="A man with blue shirt" className="w-100" />
        </picture>
      </figure>

      <div className="hero-content">
        <h2 className="h2 hero-title">Designing & Building Creative Products</h2>
        <a href="#contact" className="btn btn-primary">Contact us</a>
      </div>

      <ul className="hero-social-list">
        <li>
          <a href="#" className="hero-social-link">
            <i className="ri-facebook-fill"></i>
            <div className="tooltip">Facebook</div>
          </a>
        </li>

        <li>
          <a href="#" className="hero-social-link">
            <i className="ri-twitter-x-line"></i>
            <div className="tooltip">Twitter-X</div>
          </a>
        </li>

        <li>
          <a href="#" className="hero-social-link">
            <i className="ri-linkedin-fill"></i>
            <div className="tooltip">Linkedin</div>
          </a>
        </li>
      </ul>

      <a href="#stats" className="scroll-down">Scroll</a>
    </section>
  );
}

export default Hero;