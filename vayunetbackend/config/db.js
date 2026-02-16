const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();



// Supabase connection (DB only, not Auth)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

console.log("✅ Supabase connected successfully");

module.exports = { supabase };
