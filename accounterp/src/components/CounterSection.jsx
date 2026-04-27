import React, { useState, useEffect } from 'react';
import './CounterSection.css';

const CounterItem = ({ endValue, title, icon }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000; // 2 seconds mein animation khatam hogi
    const increment = endValue / (duration / 10);

    const timer = setInterval(() => {
      start += increment;
      if (start >= endValue) {
        setCount(endValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 10);

    return () => clearInterval(timer);
  }, [endValue]);

  return (
    <div className="counter-card">
      <div className="counter-icon">{icon}</div>
      <h2 className="counter-number">{count}+</h2>
      <p className="counter-title">{title}</p>
    </div>
  );
};

const SimpleCounter = () => {
  return (
    <section className="simple-counter-section">
      <div className="counter-container">
        <CounterItem endValue={500} title="Partner Universities" icon="🎓" />
        <CounterItem endValue={15000} title="Happy Students" icon="😊" />
        <CounterItem endValue={120} title="Courses" icon="📚" />
        <CounterItem endValue={15} title="Countries" icon="🌍" />
      </div>
    </section>
  );
};

export default SimpleCounter;