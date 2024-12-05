// In Sales.jsx
import './sales.css';
import React, { useEffect, useRef } from 'react';
import Chart from '../../components/chart/Chart';
import SalesCount from '../../components/salesCount/SalesCount';
import EarnCount from '../../components/earnCount/EarnCount';
import FrescoRegCount from '../../components/fresco/FrescoRegCount';
import Chartt from '../../components/chart2/Chartt';

const Sales = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
          datasets: [
            {
              label: "Online",
              data: [30, 50, 60, 70, 60, 50, 40, 30, 60, 70, 50, 60],
              backgroundColor: "#3a86ff",
            },
            {
              label: "Offline",
              data: [20, 30, 40, 50, 40, 30, 20, 10, 40, 50, 30, 40],
              backgroundColor: "#ff006e",
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }, [chartRef]);

  return (
    <div className="sales-dashboard">
      <div className="salesHeader">
      <h1>Sales Information</h1>
      </div>
      
      {/* Top Metrics */}
      <div className="sales-metrics">
        <div className="metric">
          <h2><SalesCount/></h2> {/* Render the SalesCount component here */}
          <p className='p1'>Sales Today</p>            
        </div>
        <div className="metric">
          <h2><FrescoRegCount/></h2>
          <p className='p1'>Fresco Customers</p>
        </div>
        <div className="metric">
          <h2>Rs. <EarnCount/></h2>
          <p className='p1'>Earnings Today</p>
        </div>
      </div>

      {/* Order Summary Chart */}
      {/* <div className="order-summary"> */}
        <h3>Today Sales 24hrs</h3>
        <Chartt />
        {/* Placeholder for the chart */}
        {/* <div className="chartsales">
          
        </div> */}
      {/* </div> */}

   
    </div>
  );
};

export default Sales;
