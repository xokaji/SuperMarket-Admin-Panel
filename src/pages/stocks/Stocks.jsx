import React from 'react';
import DateTimeComponent from '../../components/dateNtime/DateTimeComponent';
import './stocks.css';
import GreetingComponent from '../../components/greeting/GreetingComponent ';

const Stock = () => {
  return (
    <div className="stock-container">
      <header className="header">
        <label><GreetingComponent/></label>
        <p className='stockmanagement'>Stock Management</p>
   
        <div className="date"><DateTimeComponent/></div>
      </header>
    <div className="overviwe"></div>
      <section className="analytics-overview">
        <div className="analytics-card green">
          <label className='category'>Grocery</label>
          <div className="buttonContainer">
            <button>View</button>
          </div>
        </div>
        <div className="analytics-card orange">
          <label className='category'>Diary & Eggs</label>
          <div className="buttonContainer">
            <button>View</button>
          </div>
        </div>
        <div className="analytics-card purple">
          <label className='category'>Meats & Seafoods</label>
          <div className="buttonContainer">
            <button>View</button>
          </div>
        </div>
        <div className="analytics-card red">
          <label className='category'>Frozen Foods</label>
          <div className="buttonContainer">
            <button>View</button>
          </div>
        </div>
      </section>

      <section className="analytics-overview">
        <div className="analytics-card green">
          <label className='category'>Beverages</label>
          <div className="buttonContainer">
            <button>View</button>
          </div>
        </div>
        <div className="analytics-card orange">
          <label className='category'>Snacks</label>
          <div className="buttonContainer">
            <button>View</button>
          </div>
        </div>
        <div className="analytics-card purple">
          <label className='category'>Bakery Foods</label>
          <div className="buttonContainer">
            <button>View</button>
          </div>
        </div>
        <div className="analytics-card red">
          <label className='category'>Health & Wellness</label>
          <div className="buttonContainer">
            <button>View</button>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Stock;
