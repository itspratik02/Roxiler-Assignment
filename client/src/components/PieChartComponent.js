// src/components/PieChartComponent.js
import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PieChartComponent = ({ data }) => {
    return (
        <div>
            <h3>Category Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={data} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChartComponent;
