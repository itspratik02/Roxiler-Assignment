import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const BarChartComponent = ({ data }) => {
    console.log("Bar chart data:", data); 

    if (data.length === 0) {
        return <div>No data available for this month.</div>;
    }

    return (
        <div>
            <h3>Price Range Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" textAnchor="end" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChartComponent;
