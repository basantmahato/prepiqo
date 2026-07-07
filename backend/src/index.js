import 'dotenv/config';
import express, { json } from 'express';
import { connectDB } from './config/db.js';
import cors from 'cors';
import dataRoutes from './routes/data.js';
import authRoutes from './routes/auth.js';
import paymentRoutes from './routes/payment.js';
import adminRoutes from './routes/admin.route.js';
import iapRoutes from './routes/iap.routes.js';
import rateLimit from 'express-rate-limit';

const app = express()
connectDB()
app.use(json())

app.use(cors());

// Define rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `windowMs`
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
    standardHeaders: true, 
    legacyHeaders: false, 
});

// Apply rate limiter to all API requests
app.use('/api', limiter);

// Mount routes with v1 versioning
app.use('/api/v1/data', dataRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/iap', iapRoutes);



const PORT = process.env.PORT || 5001;

// Root response
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API is running',
        port: PORT
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;