import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';

// --- 1. Images ko sahi se import karein ---
import Slider1 from '../assets/images/Slider1.png'; 
import Slider2 from '../assets/images/Slider2.jpeg';

import './Slider.css'; 

function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <div className="container-fluid p-0">
      <Carousel activeIndex={index} onSelect={handleSelect}>
        
        {/* First Slide */}
        <Carousel.Item>
          <img
            className="d-block w-100"
            /* --- 2. Import kiya hua variable use karein --- */
            src={Slider1} 
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Slide Index: {index}</p>
          </Carousel.Caption> 
        </Carousel.Item>

        {/* Second Slide */}
        <Carousel.Item>
          <img
            className="d-block w-100"
            /* Agar slider2.jpg public folder mein hai to '/images/slider2.jpg' chalega, 
               lekin agar wo bhi assets mein hai to Slider1 ki tarah import karke {Slider2} likhein */
            src={Slider2}
            alt="Second slide"
          />
          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Aap abhi doosri slide par hain.</p>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Third Slide */}
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://picsum.photos/800/400?random=3"
            alt="Third slide"
          />
          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>Ye aakhri slide hai.</p>
          </Carousel.Caption>
        </Carousel.Item>
        
      </Carousel>
    </div>
  );
}

export default ControlledCarousel;