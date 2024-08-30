import dotenv from 'dotenv';
import express from 'express';
dotenv.config();
import app from './app';

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});