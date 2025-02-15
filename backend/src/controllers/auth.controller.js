import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import { errorHandler } from "../utils/error.js";

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const findUser = await User.findOne({ email });
    if (findUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({
      message: "User created successfully",
      newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    const findUser = await User.findOne({ email });

    if (!findUser) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const validPassword = bcryptjs.compareSync(password, findUser.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }


    const token = jwt.sign({ id: findUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

  
    const { password: pass, ...userData } = findUser._doc;

   
    res.status(200).json({
      success: true,
      message: "Login successful",
      token, 
      user: userData, 
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
    
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const { password: pass, ...userData } = user._doc;

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token, 
        user: userData,
      });
    } 

    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

    const newUser = new User({
      name: req.body.name,
      username:
        req.body.name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4),
      email: req.body.email,
      profilePic: req.body.profilePic || "https://example.com/default-profile.jpg",
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password: pass, ...newUserData } = newUser._doc;

    res.status(200).json({
      success: true,
      message: "Signup & Login successful",
      token,
      user: newUserData, 
    });

  } catch (error) {
    console.error(error);
    next(error);
  }
};

