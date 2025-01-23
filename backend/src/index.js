import express from "express";
import mongoose from "mongoose"
import dotenv from "dotenv"


dotenv.config()


const app = express();

app.use("/", (req, res) => {
  res.send("Hello World");
});


// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Connected to MongoDB"))
.catch((err)=>console.log(`MongoDB connection error:`,err))


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
