import React, { useState, useEffect } from 'react';
import { fetchTransactions, fetchStatistics, fetchBarChartData, fetchPieChartData } from './api';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChartComponent from './components/BarChartComponent';
import PieChartComponent from './components/PieChartComponent';
import './App.css'; 

const App = () => {
    const [month, setMonth] = useState('March');
    const [transactions, setTransactions] = useState([]);
    const [statistics, setStatistics] = useState({});
    const [barChartData, setBarChartData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);

   
    useEffect(() => {
        const fetchData = async () => {
            try {
                const transactionsResponse = await fetchTransactions(month);
                setTransactions(transactionsResponse.data);

                const statisticsResponse = await fetchStatistics(month);
                setStatistics(statisticsResponse.data);

                const barChartResponse = await fetchBarChartData(month);
                console.log("Bar Chart Response:", barChartResponse.data); // Log the raw response data

                setBarChartData(barChartResponse.data); 

                const pieChartResponse = await fetchPieChartData(month);
                setPieChartData(pieChartResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [month]);

    return (
        <div className="container">
            <h1>Transaction Dashboard</h1>

        
            <select onChange={(e) => setMonth(e.target.value)} value={month}>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
            </select>

            
            <TransactionsTable transactions={transactions} />

            
            <div className="statistics">
                <Statistics statistics={statistics} />
            </div>

            
            <div className="chart">
                <BarChartComponent data={barChartData} /> { }
            </div>

            
            <div className="chart">
                <PieChartComponent data={pieChartData} />
            </div>
        </div>
    );
};

export default App;
