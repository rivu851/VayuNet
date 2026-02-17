const { hashPassword, comparePassword } = require("../utils/hash");
const { signToken, verifyToken } = require("../utils/jwt");
const {supabase} = require("../config/db");

const signup = async (req, res, next) => {
  try {
    const { name, email, password, role = "user" } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "all fields are not present",
        errorCode: 400,
      });
    }
    

    if (password.length < 6) {
      return res.status(400).json({
        message: "password muxt not be less than 6 charecters",
        errorCode: 400,
      });
    }
   const { data: existingUser, error } = await supabase
  .from("User")
  .select("*")
  .eq("email", email)
  .maybeSingle();
    if (error) {
      throw error;
    }
    if (existingUser) {
      return res.status(409).json({
        message: "user already exist",
        errorCode: 400,
      });
    }
    // const hashedPassword = await hashPassword(password);
       const hashedPassword = password;   // for testing, remove this line and uncomment above line in production

   const { data, error: userError } = await supabase
  .from("User")
  .insert([{ name, email, password: hashedPassword, role }])
  .select()
  .single();
    if (userError) {
      return res.status(500).json({
        message: "failed to create user",
        errorCode: 500,
      });
    }

    const token = signToken({ id: data.id, role: data.role });

    res.cookie("token", token, {          //this will be used in web automatically
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true only in HTTPS
    });



    res.status(200).json({
      message: "signup successful",
      token,          // this will be used in app and to be stored in EncryptedSharedPreferences/ Android Keystore/ other libraries(best)
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "failed to signup",
      err: err,
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "all fields not present",
        statusCode: 400,
      });
    }
    const { data: user, error } = await supabase
      .from("User")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) throw error;

    //if user exist
    if (!user) {
      return res.status(400).json({
        message: "user not registered",
        statusCode: 400,
      });
    }

    // const isPasswordCorrect = await comparePassword(password, user.password);
       const isPasswordCorrect = password === user.password;   // for testing, remove this line and uncomment above line in production 

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "incorrect password",
        statusCode: 400,
      });
    }

    const token = signToken({ id: user.id, role: user.role });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true only in HTTPS
    });

    res.status(200).json({
      message: "logged in successfully",
      token,
      user: {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "failed to login",
      error: err.message,
    });
  }
};

const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
// for android logout--> dont call this, do in clint: secureStorage.delete("jwt")/ or where ever u r storing the token

module.exports = { signup, login, logout };
