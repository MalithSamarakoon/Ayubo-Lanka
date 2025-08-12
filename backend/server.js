import express from 'express';
import dotenv from 'dotenv';
import { connect } from 'http2';
import { connectDB } from './lib/db';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})
