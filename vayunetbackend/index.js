const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { supabase } = require("./config/db");
const registerRoutes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
// const { createClient } = require("@supabase/supabase-js");


dotenv.config();

const app = express();








app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);


app.use((req, res, next) => {
  console.log(`${req.method}   ${req.url}`);
  next();
});

app.get("/api/health", (req, res) => {
  res.json({
    message: "health ok!",
    time: new Date(),
  });
});

registerRoutes(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(errorHandler);