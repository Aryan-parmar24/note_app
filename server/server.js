import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import noteRouter from './routes/note.js';
import connectToMongoDB from './config/db.js';

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
}));

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/note', noteRouter);

app.get('/', (req, res) => {
    res.json({ message: "Note App Backend Running" });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, (error) => {
    if (error) {
        console.log("Server is not running");
    } else {
        connectToMongoDB();
        console.log(`Server is runnin on port ${PORT}`);
    }
});