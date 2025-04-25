import React, { useState, useEffect } from 'react';

function GoTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 10) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <a href="#top" 
      className={`go-top ${isVisible ? 'active' : ''}`} 
      onClick={(e) => {
        e.preventDefault();
        scrollToTop();
      }}
      title="Go to Top"
    >
      <ion-icon name="arrow-up"></ion-icon>
    </a>
  );
}

export default GoTop;