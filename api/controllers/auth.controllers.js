import { errorHandler } from "../Utils/errors.js";
import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';

export const signup = async (req, resp, next) => {
  const {username, email, password} = req.body;
  if(!(!!username && !!email && !!password)){
    next(errorHandler(400, "All fields are required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = User({
    username: username,
    email: email,
    password: hashedPassword
  });



  try {
    await newUser.save();
    resp.json({message: "signup successful"})
  } catch (error) {
    next(error);
  }


}