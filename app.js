const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

require("./config/databases");

const agentRoutes = require("./routes/agentRoutes");
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require("./routes/UserRouter");
const distributionRoutes = require('./routes/distribution');
const session = require("express-session");
const flash = require("connect-flash");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors()); // allow frontend requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "superSecret",
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());

// Routes
app.get("/", (req, res) => res.send("Server is working"));
app.use("/users", userRoutes);
app.use("/agents", agentRoutes);
app.use('/upload', uploadRoutes);
app.use('/distribution', distributionRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
