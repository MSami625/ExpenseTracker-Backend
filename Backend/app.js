require("dotenv").config();
const express = require("express");
const connectDB = require("./util/database");
const cors = require("cors");
const authRoute = require("./routes/authRoute");
const expensesRoute = require("./routes/expensesRoute");
const paymentRoute = require("./routes/purchasePremiumRoute");
const premiumRoute = require("./routes/premiumRoute");
const forgotPwRoute = require("./routes/forgotPwRoute");
const helmet = require("helmet");
const path = require("path");

const app = express();

//midlewares
app.use(cors());

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(express.json());

// Routes
app.use("/api", authRoute);
app.use("/api", expensesRoute);
app.use("/api", paymentRoute);
app.use("/api", premiumRoute);
app.use("/api", forgotPwRoute);

const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });
