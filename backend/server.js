import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js"
import cartRoute from "./routes/cartRoute.js";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}
));

app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);



app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
