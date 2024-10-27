import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import './analytics.css';

const Analytics = () => {
    const [totalSales, setTotalSales] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [frescoCount, setFrescoCount] = useState(0); // Fresco Registration Count
    const [customerCount, setCustomerCount] = useState(0); // Customer Count
    const [topProducts, setTopProducts] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch all data simultaneously
                const transactionsRef = collection(db, 'transactions');
                const productsRef = query(collection(db, 'products'), orderBy('sales', 'desc'), limit(5));
                const monthlySalesRef = collection(db, 'monthlySales');
                const frescoRef = collection(db, 'frescoRegistrations'); // Collection for Fresco registrations
                const customersRef = collection(db, 'users'); // Assuming users collection holds customer data

                const [
                    transactionsSnapshot,
                    productsSnapshot,
                    monthlySalesSnapshot,
                    frescoSnapshot,
                    customersSnapshot
                ] = await Promise.all([
                    getDocs(transactionsRef),
                    getDocs(productsRef),
                    getDocs(monthlySalesRef),
                    getDocs(frescoRef),
                    getDocs(customersRef),
                ]);

                let sales = 0;
                let orders = 0;
                transactionsSnapshot.forEach((doc) => {
                    const data = doc.data();
                    sales += data.totalPrice; // Assuming totalPrice is a field in your transaction data
                    orders += 1;
                });
                setTotalSales(sales);
                setTotalOrders(orders);

                // Fetch top products
                const topProductsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setTopProducts(topProductsData);

                // Fetch monthly sales data
                const monthlyData = monthlySalesSnapshot.docs.map(doc => ({
                    month: doc.id,
                    sales: doc.data().totalSales,
                }));
                setMonthlyData(monthlyData);

                // Fetch Fresco Registration Count
                setFrescoCount(frescoSnapshot.size); // Number of documents in frescoRegistrations collection

                // Fetch Customer Count
                setCustomerCount(customersSnapshot.size); // Number of documents in users collection
            } catch (error) {
                console.error('Error fetching analytics data:', error);
                setError('Error fetching analytics data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
               
                <p>Loading analytics data...</p>
            </div>
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="analytics-container">
            <h1 className="analytics-title">Analytics Dashboard</h1>
            <div className="metrics">
                <div className="metric-card">
                    <h2>Total Sales</h2>
                    <p>${totalSales.toFixed(2)}</p>
                </div>
                <div className="metric-card">
                    <h2>Total Orders</h2>
                    <p>{totalOrders}</p>
                </div>
                <div className="metric-card">
                    <h2>Fresco Registrations</h2>
                    <p>{frescoCount}</p>
                </div>
                <div className="metric-card">
                    <h2>Customer Count</h2>
                    <p>{customerCount}</p>
                </div>
            </div>
            <div className="top-products">
                <h3>Top-Selling Products</h3>
                <ul>
                    {topProducts.map(product => (
                        <li key={product.id} className="top-product-item">
                            {product.name} - ${product.price}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="chart-container">
                <h3>Monthly Sales Trend</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Analytics;
