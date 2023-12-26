import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'

const app = express();
dotenv.config();

mongoose.connect(process.env.mongo_connection_string)
.then(() => {
  console.log("MongoDB is connected");
}).catch((err) => {
  console.error(err);
})

app.listen(3000, () => {
  console.log("Listening on port 3000");
});