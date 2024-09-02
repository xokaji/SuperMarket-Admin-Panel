import React, { useEffect, useState } from 'react';
import "./greetingcomponent.css"


const GreetingComponent = () => {
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

  return <label className='greeting'>{greeting}, Basura</label>;
};

export default GreetingComponent;
