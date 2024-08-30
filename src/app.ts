import express from 'express';
import mongoose from 'mongoose';
import routes from './routes';

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI || '').then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

app.use('/', routes);

export default app;
