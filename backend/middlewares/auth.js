import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";


export const isAuthenticated = async (req, res, next) => {
  try {
    // Check if token exists in cookies
    const token = req.cookies.token;
    if (!token) {
      throw new ErrorHandler("User not authorized", 401);
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Retrieve user data from database
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }

    // Attach user object to request for further use
    req.user = user;

    // Call next middleware
    next();
  } catch (error) {
    next(error); // Forward error to error handler middleware
  }
};
/*
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const  token = req.cookies.token;
  if (!token) {
    return next(new ErrorHandler("User Not Authorized", 401));
  }
  //const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

 // req.user = await User.findById(decoded.id);
 try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);
  next();
} catch (err) {
  return next(new ErrorHandler("Invalid or Expired Token", 401));
}

  //next();
});
*/
