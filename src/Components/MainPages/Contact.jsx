import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <section className="contact" id="contact">
      <div className="contact-content section-content">
        <p className="section-subtitle">Contact</p>
        <h2 className="h3 section-title">Have you any project? Drop a message!</h2>
        <p className="section-text">Get in touch and let me know if I can help! Fill out the form and I'll be in touch as soon as possible</p>

        <ul className="contact-list">
          <li className="contact-list-item">
            <div className="contact-item-icon">
              <ion-icon name="location-outline"></ion-icon>
            </div>

            <div className="wrapper">
              <h3 className="h4 contact-item-title">Address: </h3>
              <address className="contact-info">
                725 Broadway, New York, NY 10003, USA
              </address>
            </div>
          </li>

          <li className="contact-list-item">
            <div className="contact-item-icon">
              <ion-icon name="call-outline"></ion-icon>
            </div>

            <div className="wrapper">
              <h3 className="h4 contact-item-title">Phone: </h3>
              <a href="tel:6461234567" className="contact-info">(646) 123-4567</a>
              <a href="tel:6467890123" className="contact-info">(646) 789-0123</a>
            </div>
          </li>

          <li className="contact-list-item">
            <div className="contact-item-icon">
              <ion-icon name="mail-outline"></ion-icon>
            </div>

            <div className="wrapper">
              <h3 className="h4 contact-item-title">Email: </h3>
              <a href="mailto:info@jack.com" className="contact-info">info@jack.com</a>
              <a href="mailto:support@jack.com" className="contact-info">support@jack.com</a>
            </div>
          </li>

          <li>
            <ul className="contact-social-list">
              <li>
                <a href="#" className="contact-social-link">
                  <div className="tooltip">Facebook</div>
                  <i className="ri-facebook-fill"></i>   
                </a>
              </li>

              <li>
                <a href="#" className="contact-social-link">
                  <div className="tooltip">X-Twitter</div>
                  <i className="ri-twitter-x-line"></i>   
                </a>
              </li>

              <li>
                <a href="#" className="contact-social-link">
                  <div className="tooltip">Linkedin</div>
                  <i className="ri-linkedin-fill"></i>   
                </a>
              </li>

              <li>
                <a href="#" className="contact-social-link">
                  <div className="tooltip">Youtube</div>
                  <i className="ri-youtube-fill"></i>  
                </a>
              </li>
            </ul>                   
          </li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-wrapper">
          <label htmlFor="name" className="form-label">Name</label>
          <div className="input-wrapper">
            <input 
              type="text" 
              name="name" 
              id="name" 
              required 
              placeholder="John Doe" 
              className="input-field"
              value={formData.name}
              onChange={handleChange}
            />
            <ion-icon name="person-outline"></ion-icon>
          </div>
        </div>

        <div className="form-wrapper">
          <label htmlFor="email" className="form-label">Email</label>
          <div className="input-wrapper">
            <input 
              type="email" 
              name="email" 
              id="email" 
              required 
              placeholder="johndoe@gmail.com" 
              className="input-field"
              value={formData.email}
              onChange={handleChange}
            />
            <ion-icon name="mail"></ion-icon>
          </div>
        </div>

        <div className="form-wrapper">
          <label htmlFor="phone" className="form-label">Phone</label>
          <div className="input-wrapper">
            <input 
              type="tel" 
              name="phone" 
              id="phone" 
              required 
              placeholder="Phone Number" 
              className="input-field"
              value={formData.phone}
              onChange={handleChange}
            />
            <ion-icon name="call"></ion-icon>
          </div>
        </div>

        <div className="form-wrapper">
          <label htmlFor="message" className="form-label">Message</label>
          <div className="input-wrapper">
            <textarea 
              name="message" 
              id="message" 
              className="input-field" 
              required 
              placeholder="Write your Message"
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            <ion-icon name="chatbubbles"></ion-icon>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Send</button>
      </form>
    </section>
  );
}

export default Contact;