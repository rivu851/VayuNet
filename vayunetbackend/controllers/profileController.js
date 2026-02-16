const { supabase } = require("../config/db");

const viewProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: user, error } = await supabase
      .from("User")
      .select("id, name, email, role")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw error;

    if (!user) {
      return res.status(404).json({
        message: "user does not exist",
      });
    }

    res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({
      message: "failed to fetch profile",
      error: err.message,
    });
  }
};

module.exports = viewProfile;
