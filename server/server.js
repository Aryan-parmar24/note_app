import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import noteRouter from './routes/note.js';
import connectToMongoDB from './config/db.js';

const app = express();

app.use(cors({
    origin: '*',  // For mobile app, allow all origins
    credentials: true
}));
app.use(express.json());
app.use('/api/auth',authRouter);
app.use('/api/note',noteRouter);
// app.use("/",(req,res) => {
//     res.json({code:1,msg:"server is running..."});
// });

const PORT = process.env.PORT || 5050;
app.listen(PORT,(error) => {
    if(error){
        console.log("Server is not running");
    } else{
        connectToMongoDB();
        console.log(`Server is runnin on port ${PORT}`);
    }
});