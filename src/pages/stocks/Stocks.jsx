import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import DateTimeComponent from '../../components/dateNtime/DateTimeComponent';
import GreetingComponent from '../../components/greeting/GreetingComponent';
import './stocks.css';
import "../../dummyData"
import { Link } from 'react-router-dom';
export const data = [
    { name: 'Grocery', stock: 120 },
    { name: 'Dairy & Eggs', stock: 80 },
    { name: 'Meats & Seafoods', stock: 50 },
    { name: 'Frozen Foods', stock: 65 },
    { name: 'Beverages', stock: 95 },
    { name: 'Snacks', stock: 75 },
    { name: 'Bakery Foods', stock: 60 },
    { name: 'Health & Wellness', stock: 40 },
  ];

const Stock = () => {
  return (
   
    <div className="stock-container">
      <header className="header">
        <label>
          <GreetingComponent />
        </label>
        <p className="stockmanagement">Stock Management</p>
        <div className="date">
          <DateTimeComponent />
        </div>
      </header>

      <section className="analytics-overview">
        <div className="analytics-card1">
          <label className="category">Grocery</label>
          
          <div className="buttonContainer">
            <Link to="/stockreports/grocery">
              <button>View</button>
            </Link>
          </div>
         
        </div>
        <div className="analytics-card2">
          <label className="category">Dairy & Eggs</label>
          <div className="buttonContainer">
            <Link to="/stockreports/dairy&eggs">
              <button>View</button>
            </Link>
          </div>
        </div>
        <div className="analytics-card3">
          <label className="category">Meats & Seafoods</label>
          <div className="buttonContainer">
          <Link to="/stockreports/meat&seafoods">
              <button>View</button>
            </Link>
          </div>
        </div>
        <div className="analytics-card4">
          <label className="category">Frozen Foods</label>
          <div className="buttonContainer">
            <Link to="/stockreports/frozenfoods">
              <button>View</button>
            </Link>
          </div>
        </div>
      </section>

      <section className="analytics-overview">
        <div className="analytics-card5">
          <label className="category">Beverages</label>
          <div className="buttonContainer">
            <Link to="/stockreports/beverages">
              <button>View</button>
            </Link>
          </div>
        </div>
        <div className="analytics-card6">
          <label className="category">Snacks</label>
          <div className="buttonContainer">
          <Link to="/stockreports/snacks">
              <button>View</button>
            </Link>
          </div>
        </div>
        <div className="analytics-card7">
          <label className="category">Bakery Foods</label>
          <div className="buttonContainer">
          <Link to="/stockreports/bakery">
              <button>View</button>
            </Link>
          </div>
        </div>
        <div className="analytics-card8">
          <label className="category">Health & Wellness</label>
          <div className="buttonContainer">
          <Link to="/stockreports/health">
              <button>View</button>
            </Link>
          </div>
        </div>
      </section>
      

      {/* Bar Chart Section */}
      <section className="chart-section">
        <h3>Most Used Stocks by Monthly</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="stock" fill="rgba(36, 35, 36, 0.8)" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default Stock;
