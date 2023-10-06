import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { MongoClient } from 'mongodb'; // Import MongoClient
import authRoutes from './routes/authRoute.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoute from './routes/orderRoute.js';
import saleprodRoute from './routes/saleprodRoute.js';
import cors from 'cors';
import path from 'path';

dotenv.config();

// Create an instance of Express
const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './client/build')));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.use(
  cors({
    origin: 'http://localhost:3000', // Replace with your frontend's actual URL
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Enable CORS credentials (if needed)
  })
);

// Define MongoDB connection URL and options
const mongoURL = process.env.MONGO_URL;
const mongoOptions = {
  poolSize: 10, // Adjust the pool size as needed
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Create a MongoDB client and connect to the database
const client = new MongoClient(mongoURL, mongoOptions);

(async () => {
  try {
    await client.connect(); // Connect to MongoDB

    // Routes
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/category', categoryRoutes);
    app.use('/api/v1/product', productRoutes);
    app.use('/api/v1/saleproduct', saleprodRoute);
    app.use('/api/v1/order', orderRoute);

    // REST API route
    app.use('*', function (req, res) {
      res.sendFile(path.join(__dirname, './client/build/index.html'));
    });

    // Port
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
})();

// Handle application termination
process.on('SIGINT', async () => {
  try {
    await client.close(); // Close the MongoDB connection pool
    console.log('MongoDB connection pool closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection pool:', error);
    process.exit(1);
  }
});
