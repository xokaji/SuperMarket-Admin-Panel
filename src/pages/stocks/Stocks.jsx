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

      {/* <section className="products-stock-list">
        <h2>Products Stock List</h2>
        <table>
          <thead>
            <tr>
              <th>Purchase Date</th>
              <th>ID</th>
              <th>Milk Name</th>
              <th>Stock Status</th>
              <th>In Stock</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2019-06-12</td>
              <td>001</td>
              <td>Whole Milk</td>
              <td className="status in-stock">In Stock</td>
              <td>20 Gallons</td>
              <td>90 Gallons</td>
            </tr>
            <tr>
              <td>2019-06-12</td>
              <td>002</td>
              <td>2% Milk</td>
              <td className="status in-stock">In Stock</td>
              <td>18 Gallons</td>
              <td>70 Gallons</td>
            </tr>
            <tr>
              <td>2019-06-12</td>
              <td>003</td>
              <td>Skim (Nonfat) Milk</td>
              <td className="status low-stock">Low Stock</td>
              <td>8 Gallons</td>
              <td>75 Gallons</td>
            </tr>
            <tr>
              <td>2019-06-12</td>
              <td>004</td>
              <td>Half and Half Milk</td>
              <td className="status out-of-stock">Out of Stock</td>
              <td>0 Gallon</td>
              <td>70 Gallons</td>
            </tr>
            <tr>
              <td>2019-06-12</td>
              <td>005</td>
              <td>Heavy Cream Milk</td>
              <td className="status critically-low">Critically Low</td>
              <td>5 Gallons</td>
              <td>75 Gallons</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="chart-section">
        <div className="chart-placeholder">
         
          <p>Chart Placeholder</p>
        </div>
      </section> */}
    </div>
  );
};

export default Stock;
