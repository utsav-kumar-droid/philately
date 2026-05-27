const bcrypt =
  require("bcryptjs");

const jwt =
  require("jsonwebtoken");

const User =
  require("../models/Users");

const validUser =
  require("../utils/validateUser");

/* ======================== */
/* GENERATE JWT */
/* ======================== */

const generateToken = (
  id,
  role
) => {

  if (!process.env.JWT_SECRET) {

    throw new Error(
      "JWT_SECRET is not defined"
    );
  }

  return jwt.sign(

    { id, role },

    process.env.JWT_SECRET,

    {
      expiresIn:
        process.env.JWT_EXPIRES_IN ||
        "1d",
    }
  );
};

/* ======================== */
/* REGISTER */
/* ======================== */

const register =
  async(req,res)=>{

    console.log(
      "REQ BODY:",
      req.body
    );

    try{

      const validatedData =
        validUser(req.body);

      const existingUser =
        await User.findOne({

          emailId:
            validatedData.emailId
              .trim()
              .toLowerCase(),
        });

      if(existingUser){

        return res
          .status(400)
          .json({

            success:false,

            message:
              "⚠️ User already exists",
          });
      }

      const newUser =
        await User.create({

          firstName:
            validatedData.firstName,

          lastName:
            validatedData.lastName || "",

          emailId:
            validatedData.emailId
              .trim()
              .toLowerCase(),

          age:
            validatedData.age,

          password:
            validatedData.password,

          role:"user",
        });

      const token =
        generateToken(

          newUser._id,

          newUser.role
        );

      res.cookie(

        "token",

        token,

        {

          httpOnly:true,

          secure:
            process.env.NODE_ENV ===
            "production",

          sameSite:"Lax",

          maxAge:
            24 * 60 * 60 * 1000,
        }
      );

      res.status(201).json({

        success:true,

        message:
          "🎉 Registration successful",

        user:{

          id:newUser._id,

          emailId:
            newUser.emailId,

          firstName:
            newUser.firstName,

          age:
            newUser.age,

          role:
            newUser.role,
        },

        token,
      });

    }catch(err){

      console.error(
        "❌ Register Error:",
        err
      );

      res.status(500).json({

        success:false,

        message:
          err.message ||
          "Server error during registration",
      });
    }
  };

/* ======================== */
/* LOGIN */
/* ======================== */

const login =
  async(req,res)=>{

    try{

      const {
        emailId,
        password,
      } = req.body;

      if(
        !emailId ||
        !password
      ){

        return res
          .status(400)
          .json({

            success:false,

            message:
              "❌ Please enter both email and password",
          });
      }

      const email =
        emailId
          .trim()
          .toLowerCase();

      const user =
        await User.findOne({

          emailId:email,

        }).select("+password");

      if(!user){

        return res
          .status(400)
          .json({

            success:false,

            message:
              "⚠️ Invalid email or password",
          });
      }

      const isMatch =
        await bcrypt.compare(

          password,

          user.password
        );

      if(!isMatch){

        return res
          .status(400)
          .json({

            success:false,

            message:
              "⚠️ Invalid email or password",
          });
      }

      const token =
        generateToken(

          user._id,

          user.role
        );

      res.cookie(

        "token",

        token,

        {

          httpOnly:true,

          secure:
            process.env.NODE_ENV ===
            "production",

          sameSite:"Lax",

          maxAge:
            24 * 60 * 60 * 1000,
        }
      );

      res.status(200).json({

        success:true,

        message:
          "✅ Login successful",

        user:{

          id:user._id,

          emailId:
            user.emailId,

          firstName:
            user.firstName,

          age:
            user.age,

          role:
            user.role,
        },

        token,
      });

    }catch(err){

      console.error(
        "❌ Login Error:",
        err
      );

      res.status(400).json({

        success:false,

        message:
          err.message ||
          "Server error during login",
      });
    }
  };

/* ======================== */
/* GET USER */
/* ======================== */

const getUser =
  async(req,res)=>{

    try{

      if(!req.user){

        return res
          .status(401)
          .json({

            success:false,

            message:
              "❌ Unauthorized",
          });
      }

      res.status(200).json({

        success:true,

        user:req.user,
      });

    }catch(err){

      console.error(
        "❌ Fetch User Error:",
        err
      );

      res.status(400).json({

        success:false,

        message:
          "Server error fetching user",
      });
    }
  };

/* ======================== */
/* EXPORTS */
/* ======================== */

module.exports = {

  register,

  login,

  getUser,
};

