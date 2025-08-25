import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {connectDB} from "./config/dbConnect.js";
import routes from "./routes/authRoutes.js";  
import fileRoutes from "./routes/fileRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

connectDB();


app.use("/api/auth", routes);
app.use("/api/files", fileRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
app.get("/", (req, res) => {
  res.send("API is running...");
});