import React, { useEffect, useState } from 'react';

const DateTimeComponent = () => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {

    const formatDate = () => {
      const date = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options) + ', ' + date.toLocaleTimeString('en-US');
    };


    setCurrentDate(formatDate());


    const timer = setInterval(() => {
      setCurrentDate(formatDate());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <div className="date">{currentDate}</div>;
};

export default DateTimeComponent;
