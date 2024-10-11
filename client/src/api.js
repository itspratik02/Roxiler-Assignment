// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; 

export const fetchTransactions = (month) => {
    return axios.get(`${API_URL}/transactions?month=${month}`);
};

export const fetchStatistics = (month) => {
    return axios.get(`${API_URL}/statistics?month=${month}`);
};

export const fetchBarChartData = (month) => {
    return axios.get(`${API_URL}/bar-chart?month=${month}`);
};

export const fetchPieChartData = (month) => {
    return axios.get(`${API_URL}/pie-chart?month=${month}`);
};

export const fetchCombinedData = (month) => {
    return axios.get(`${API_URL}/combined?month=${month}`);
};
