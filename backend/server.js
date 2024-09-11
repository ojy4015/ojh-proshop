import path from 'path';
import express from 'express';
import cors from 'cors';
// import products from './data/products.js';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const port = process.env.PORT || 5000;

connectDB();

// initialize app variable
const app = express();

// Enable All CORS Requests
// const corsOptions = {
//   origin: true, // Change this to the origin(s) you want to allow.
//   credentials: true, // Indicates that cookies and credentials should be included.
// };

// app.use(cors(corsOptions));

// create a route with express, http://localhost:5000
app.get('/', (req, res) => {
  // res.status(200).json({ message: 'Welcome to the Support Desk API' });
  res.send('API is running...');
});

// app.get('/api/products', (req, res) => {
//   // res.status(200).json({ message: 'Welcome to the Support Desk API' });
//   res.json(products);
// });

// app.get('/api/products/:id', (req, res) => {
//   const product = products.find((p) => p._id === req.params.id);
//   res.json(product);
// });

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  // set static folder
  app.use('/uploads', express.static('/var/data/uploads'));
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  // any route that is not api will be redirected to index.html
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  // using React Dev Server
  const __dirname = path.resolve();
  app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

// Make uploads folder static
const __dirname = path.resolve(); // Set __dirname to current directory
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(notFound);
app.use(errorHandler);

// app.listen(port, () => console.log(`Server running on port ${port}`));
app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);

// const server = () => {
//   return console.log('Hello world');
// };

// export default server;
