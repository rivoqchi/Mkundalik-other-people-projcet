import Carousel from 'react-bootstrap/Carousel';
import slider1 from './Images/slider1.webp';
import slider2 from './Images/slider2.jpg';
import slider3 from './Images/slider3.jpg';

function Carusel() {
  return (
    <>
    <div className="grad">.</div>
    <Carousel className='carsl' data-bs-theme="dark">
      <Carousel.Item interval={3000}>
        <img
          className="d-block w-100"
          src={slider1}
          alt="First slide"
        />
        <Carousel.Caption>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={3000}>
        <img
          className="d-block w-100"
          src={slider2}
          alt="Second slide"
        />
        <Carousel.Caption>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={3000}>
        <img
          className="d-block w-100"
          src={slider3}
          alt="Third slide"
        />
        <Carousel.Caption>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
    </>
  );
}

export default Carusel;