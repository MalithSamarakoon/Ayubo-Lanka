import express from "express";
import "dotenv/config";
import connectDB from './lib/db.js';
import productRoutes from './routes/product.route.js';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());

app.use('/api/products', productRoutes)

app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);
});
export default app;

