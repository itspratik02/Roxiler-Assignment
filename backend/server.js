const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/myDatabase')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err))


const ProductSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  price: Number,
  dateOfSale: Date,
  sold: Boolean,
  category: String
});

const Product = mongoose.model('Product', ProductSchema);

app.get('/api/initialize', async (req, res) => {
  try {
    const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    await Product.deleteMany(); 
    await Product.insertMany(data); 
    res.status(200).send('Database Initialized');
  } catch (error) {
    res.status(500).send('Error initializing database');
  }
});

app.get('/api/transactions', async (req, res) => {
    const month = req.query.month || 'March'; 

    try {
        const monthNumber = new Date(`${month} 1`).getMonth() + 1;

        const transactions = await Product.find({
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, monthNumber] 
            }
        });

        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).send('Error fetching transactions');
    }
});


app.get('/api/statistics', async (req, res) => {
    const month = req.query.month || 'March'; 

    try {
        const monthNumber = new Date(`${month} 1`).getMonth() + 1; 

        const soldItems = await Product.countDocuments({ 
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, monthNumber] 
            },
            sold: true 
        });

        const notSoldItems = await Product.countDocuments({ 
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, monthNumber] 
            },
            sold: false 
        });

        const totalSales = await Product.aggregate([
            { 
                $match: { 
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, monthNumber] 
                    },
                    sold: true 
                } 
            }, 
            { $group: { _id: null, totalAmount: { $sum: "$price" } } }
        ]);

        const totalAmount = totalSales[0] ? totalSales[0].totalAmount : 0;

        res.status(200).json({
            soldItems,
            notSoldItems,
            totalAmount
        });
    } catch (error) {
        console.error("Error fetching statistics:", error);
        res.status(500).send('Error fetching statistics');
    }
});




app.get('/api/bar-chart', async (req, res) => {
    const month = req.query.month || 'March';

    try {
        const monthNumber = new Date(`${month} 1`).getMonth() + 1;

        // Fetch products for the specified month
        const products = await Product.find({
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, monthNumber]
            }
        });

        const priceRanges = {
            '0-100': 0,
            '101-200': 0,
            '201-300': 0,
            '301-400': 0,
            '401-500': 0,
            '501-600': 0,
            '601-700': 0,
            '701-800': 0,
            '801-900': 0,
            '901-1000': 0,
            '1000+': 0,
        };

        products.forEach(product => {
            const price = product.price;

            if (price <= 100) priceRanges['0-100']++;
            else if (price <= 200) priceRanges['101-200']++;
            else if (price <= 300) priceRanges['201-300']++;
            else if (price <= 400) priceRanges['301-400']++;
            else if (price <= 500) priceRanges['401-500']++;
            else if (price <= 600) priceRanges['501-600']++;
            else if (price <= 700) priceRanges['601-700']++;
            else if (price <= 800) priceRanges['701-800']++;
            else if (price <= 900) priceRanges['801-900']++;
            else if (price <= 1000) priceRanges['901-1000']++;
            else priceRanges['1000+']++;
        });

        
        const chartData = Object.entries(priceRanges)
            .filter(([, count]) => count > 0)
            .map(([label, count]) => ({ label, count }));

      
        res.status(200).json(chartData); 
    } catch (error) {
        console.error("Error fetching bar chart data:", error);
        res.status(500).send('Error fetching bar chart data');
    }
});




app.get('/api/pie-chart', async (req, res) => {
    const month = req.query.month || 'March'; 

    try {
        const monthNumber = new Date(`${month} 1`).getMonth() + 1; 

        const categories = await Product.aggregate([
            { 
                $match: { 
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, monthNumber] 
                    }
                } 
            },
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error fetching pie chart data:", error);
        res.status(500).send('Error fetching pie chart data');
    }
});



app.get('/api/combined', async (req, res) => {
    const month = req.query.month || 'March';

    try {
        const monthNumber = new Date(`${month} 1`).getMonth() + 1;
        const transactions = await Product.find({
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, monthNumber] 
            }
        });

        const soldItems = await Product.countDocuments({ 
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, monthNumber] 
            },
            sold: true 
        });
        
        const notSoldItems = await Product.countDocuments({ 
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, monthNumber] 
            },
            sold: false 
        });

        const totalSales = await Product.aggregate([
            { 
                $match: { 
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, monthNumber]
                    },
                    sold: true 
                } 
            },
            { $group: { _id: null, totalAmount: { $sum: "$price" } } }
        ]);

        const totalAmount = totalSales[0] ? totalSales[0].totalAmount : 0;

        res.status(200).json({
            transactions,
            statistics: {
                soldItems,
                notSoldItems,
                totalAmount
            }
        });
    } catch (error) {
        console.error("Error fetching combined data:", error);
        res.status(500).send('Error fetching combined data');
    }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
