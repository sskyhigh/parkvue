// Importing dependencies using ESM syntax
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyparser from 'body-parser';

// Importing routes
import roomRouter from './routes/roomRouter.js';

// Configuring environment variables
dotenv.config();

// Setting up express
const port = process.env.PORT || 8000;
const app = express();

// Middleware to allow access from across multi-site (Uses: server & client link)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-Width, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Security and response style
app.use(express.json({ limit: '10mb' }));

// Using the roomRouter for routes starting with /room
app.use('/room', roomRouter);

// Welcome message for the main page
app.use('/', (req, res) => res.json({ message: 'Welcome to parkvue!' }));

// Error handler for unavailable links
app.use((req, res) => res.status(404).json({ success: false, message: 'Not Found' }));

// Server startup function
const startServer = async () => {
    try {
        // Before listening to requests, connect to MongoDB
        app.listen(port, () => console.log(`Server is listening on port: ${port}`));
    } catch (error) {
        console.log(error);
    }
};

// Calling the server startup function
startServer();
