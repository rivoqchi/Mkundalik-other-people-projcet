import React, { useState, useEffect } from 'react';

function Header({ theme, toggleTheme }) {
  const [isActive, setIsActive] = useState(false);
  const [isNavActive, setIsNavActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 10) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleNav = () => {
    setIsNavActive(!isNavActive);
    document.body.classList.toggle('active');
  };

  return (
    <header className={`header ${isActive ? 'active' : ''}`} data-header>
      <div className="container">
        <h1 className="h1 logo">
          <a href="#">Jack<span>.</span></a>
        </h1>

        <div className="navbar-actions">
          <select name="language" id="lang">
            <option value="en">En</option>
            <option value="es">Es</option>
          </select>

          <button 
            className={`theme-btn ${theme === 'light-theme' ? 'active' : ''}`}
            aria-label="Change Theme" 
            title="Change Theme"
            onClick={toggleTheme}
          >
            <span className="icon"></span>
          </button>
        </div>

        <button 
          className={`nav-toggle-btn ${isNavActive ? 'active' : ''}`}
          aria-label="Toggle Menu" 
          title="Toggle Menu"
          onClick={toggleNav}
        >
          <span className="one"></span>
          <span className="two"></span>
          <span className="three"></span>
        </button>

        <nav className={`navbar ${isNavActive ? 'active' : ''}`}>
          <ul className="navbar-list">
            <li><a href="#home" className="navbar-link" onClick={() => setIsNavActive(false)}>Home</a></li>
            <li><a href="#about" className="navbar-link" onClick={() => setIsNavActive(false)}>About</a></li>
            <li><a href="#skills" className="navbar-link" onClick={() => setIsNavActive(false)}>Skills</a></li>
            <li><a href="#portfolio" className="navbar-link" onClick={() => setIsNavActive(false)}>Portfolio</a></li>
            <li><a href="#contact" className="navbar-link" onClick={() => setIsNavActive(false)}>Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;