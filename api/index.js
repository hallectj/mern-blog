import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';

const app = express();
dotenv.config();

app.use(express.json())

mongoose.connect(process.env.mongo_connection_string)
.then(() => {
  console.log("MongoDB is connected");
}).catch((err) => {
  console.error(err);
})

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);