import { errorHandler } from "../Utils/errors.js";
import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if(!(!!email && !!password)){
    return next(errorHandler(400, "All Fields are Required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if(!validUser){
      return next(errorHandler(404, "Invalid Email"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if(!validPassword){
      return next(errorHandler(400, "Invalid Password"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.jwt_secretkey);

    //this line of code grabs everything except the password, we don't want to send password back
    const { password: paxxword, ...rest } = validUser._doc;

    res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest);
  } catch (error) {
    next(error);
  }
}

export const google = async (req, res, next) => {
  const {email, name, photoURL } = req.body;
  try {
    const user = await User.findOne({email});
    if(user){
      const token = jwt.sign({id: user._id}, process.env.jwt_secretkey);
      const { password, ...rest } = user._doc;
      res.status(200).cookie("access_token", token, {
        httpOnly: true,
      }).json(rest);
    }else{
      const random_password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const newUser = new User({
        username: name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
        email,
        password: random_password,
        photoURL: photoURL
      });
      await newUser.save();
      const token = jwt.sign({id: newUser._id}, process.env.jwt_secretkey);
      const { password, ...rest } = newUser._doc;
      res.status(200).cookie('access_token', token, {
        httpOnly: true
      }).json(rest);
    }
  } catch (error) {
    next(error)
  }
}