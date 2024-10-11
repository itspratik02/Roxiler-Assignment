// src/components/Statistics.js
import React from 'react';

const Statistics = ({ statistics }) => {
    return (
        <div>
            <h3>Statistics for Selected Month</h3>
            <p>Total Sold Items: {statistics.soldItems || 0}</p>
            <p>Total Not Sold Items: {statistics.notSoldItems || 0}</p>
            <p>Total Sales Amount: ${statistics.totalAmount ? statistics.totalAmount.toFixed(2) : 0}</p>
        </div>
    );
};

export default Statistics;
