const dotenv = require("dotenv");
dotenv.config();

const express =  require("express");
const cors = require("cors");
const app  = express();
const cookieParser = require("cookie-parser");

const connectToDB = require("./db/db");
const userRoutes = require("./routes/user");
const captainRoutes = require("./routes/captain");
const mapsRoutes = require("./routes/maps");
const rideRoutes = require("./routes/ride");
const paymentRoutes = require("./routes/payment");

connectToDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.get("/", (req,res) => {
    res.send("Hello World");
});
app.use("/users", userRoutes);
app.use("/captains", captainRoutes);
app.use("/maps", mapsRoutes);
app.use("/rides", rideRoutes);
app.use("/payments", paymentRoutes);

module.exports = app;