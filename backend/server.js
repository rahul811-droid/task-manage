import express from 'express';
// import connectDb from './src/config/mongoDb.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import cors from 'cors';
import path from 'path';
import {createServer } from 'node:http';
import cookieParser from 'cookie-parser';
import authRouter from './src/routes/user.route.js';
import taskRouter from './src/routes/task.route.js';
import { startWebSockets } from './src/webSocket/socket.js';
import { Server } from 'socket.io';


dotenv.config();
const app = express();
const server = createServer(app);
app.use(express.json());
app.use(cookieParser());
app.use(cors());
const __dirname = path.resolve();
const port = process.env.PORT || 4010;
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/task',taskRouter);


mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB!');
}).catch((err) => {
    console.log(err);
});


app.use(cors({
    origin: [process.env.FRONTEND_URL],
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true, // If you need to include credentials (cookies, authorization headers, etc.)
}));


app.use(express.static(path.join(__dirname, '/frontend/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
  });




const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],

    },
});
startWebSockets(io);



server.listen(port, () => {    
    console.log(`Server is running on port ${port}`);
    // connectDb();
});







app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});