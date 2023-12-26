import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';

export const signup = async (req, resp) => {
  const {username, email, password} = req.body;
  if(!(!!username && !!email && !!password)){
    return resp.status(400).json({message: "All Fields are Required"});
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
    resp.status(500).json({message: error.message})
  }


}