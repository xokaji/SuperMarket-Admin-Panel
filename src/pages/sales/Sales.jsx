
import './sales.css';
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

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
      {/* Top Metrics */}
      <div className="sales-metrics">
        <div className="metric">
          <h2>4,562</h2>
          <p>Sales Today</p>
        </div>
        <div className="metric">
          <h2>27,424</h2>
          <p>Visitors Today</p>
        </div>
        <div className="metric">
          <h2>$29,200</h2>
          <p>Earnings Today</p>
        </div>
      </div>

      {/* Order Summary Chart */}
      <div className="order-summary">
        <h3>Order Summary</h3>
        {/* Here, you could integrate a chart library like Chart.js */}
        <div className="chartsales">
          {/* Placeholder for the chart */}
          
        </div>
      </div>

      {/* Sales Overview */}
      <div className="sales-overview">
        <h3>Sales Overview</h3>
        <div className="sales-item">
          <p>iPod</p>
          <span className="amount positive">+ $250</span>
        </div>
        <div className="sales-item">
          <p>Mi Phone</p>
          <span className="amount negative">- $589</span>
        </div>
        <div className="sales-item">
          <p>Mi TV</p>
          <span className="amount positive">+ $1,292</span>
        </div>
        <div className="total-sales">
          <p>Total Sales</p>
          <h2>$8,459k</h2>
        </div>
      </div>
    </div>
  );
};

export default Sales;
