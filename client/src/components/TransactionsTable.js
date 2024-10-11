// src/components/TransactionsTable.js
import React from 'react';
import './TransactionsTable.css'; 

const TransactionsTable = ({ transactions }) => {
    return (
        <div>
            <h2>Transactions for Selected Month</h2>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Date</th>
                        <th>Sold</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length > 0 ? (
                        transactions.map(transaction => (
                            <tr key={transaction._id}>
                                <td>{transaction.title}</td>
                                <td>{transaction.description}</td>
                                <td>${transaction.price.toFixed(2)}</td>
                                <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                                <td>{transaction.sold ? 'Yes' : 'No'}</td>
                                <td>{transaction.category}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>No transactions found for this month.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionsTable;
