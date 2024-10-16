import React, { useEffect, useState } from 'react';
import './greetingcomponent.css';

const GreetingComponent = ({ name }) => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const determineGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        return 'Good Morning';
      } else if (hour < 18) {
        return 'Good Afternoon';
      } else {
        return 'Good Evening';
      }
    };

    setGreeting(determineGreeting());
  }, []);

  return <label className='greeting'>{greeting}, {name}</label>;
};

export default GreetingComponent;
