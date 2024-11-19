import express from 'express';
import connectDB from './config/db.mjs';
import dotenv from 'dotenv';
import cors from 'cors'
import userRouters from './routes/userRoutes.mjs';
import authRoutes from './routes/auth.mjs'
import locationRoutes from './routes/locationRoutes.mjs'


// Setup -----------------------------
dotenv.config();
const app = express();
let PORT = process.env.PORT || 3000;

// DB Connection -------------------- 
connectDB();

// Middleware ---------------------
app.use(express.json({ extended: false }));
app.use(cors()) //use cors to connect backend with frontend


// Routes ------------------------------
app.use('/api/users', userRouters ); //create new user
app.use('/api/auth', authRoutes); //login
app.use('/api/location', locationRoutes)// new location


app.listen(PORT, () =>{
console.log(`Server is runnig on PORT: ${PORT}`)
});
