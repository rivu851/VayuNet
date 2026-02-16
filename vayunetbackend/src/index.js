import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// Supabase connection (DB only, not Auth)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// =============================
// ✅ LOGIN ROUTE (Manual Auth)
// =============================
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    // 1️⃣ Find user by email
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    /* 2️⃣ Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);*/

    if (user.password!=password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    /* 3️⃣ Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );*/

    // 4️⃣ Send response
    return res.status(200).json({
      message: "Login successful",
      //token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
