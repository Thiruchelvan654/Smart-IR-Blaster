require("dotenv").config();

const express = require("express");
const cors = require('cors');
const sql = require("./config/database");

const app = express();
const PORT = process.env.PORT || 5000;

const routes = require("./routes/iroutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddlewares");

// Middleware

app.use(express.json());
app.use(cors());

app.use("/api", authMiddleware.authMiddleware, routes);
app.use("/auth", authRoutes);
const startServer = async () => {
  try {
    // Simple test query
    const result = await sql`SELECT 1`;
    console.log("Database connected:", result[0]);

    // Start server only after successful DB check
    app.listen(PORT,'0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to database:", err);
    process.exit(1); // Exit if DB connection fails
  }
};

startServer();
