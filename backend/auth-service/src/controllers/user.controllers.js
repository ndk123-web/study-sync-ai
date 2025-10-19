import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import wrapper from "../utils/Wrapper.js";
import User from "../models/user.models.js";
import admin from "firebase-admin"; // make sure this is configured
// const userRecord = await admin.auth().getUser(decoded.uid);

const signUpController = wrapper(async (req, res) => {
  const firebaseSignUpUser = req.user;
  const { username } = req.body;

  console.log("Firebase Response: ",firebaseSignUpUser);

  if (!firebaseSignUpUser || !firebaseSignUpUser.uid) {
    throw new ApiError(401, "Invalid Firebase authentication");
  }

  if (!username || !username.trim()) {
    throw new ApiError(400, "Username is required");
  }

  let newUser = null;

  try {
    // Check if user already exists
    const isExistUser = await User.findOne({ uid: firebaseSignUpUser.uid });
    if (isExistUser) {
      // If user exists, return existing user data instead of throwing error
      return res.status(200).json(new ApiResponse(200, isExistUser));
    }

    // Create new user
    newUser = await User.create({
      uid: firebaseSignUpUser.uid,
      username: username.trim(),
      photoURL: firebaseSignUpUser.picture || null,
      email: firebaseSignUpUser.email,
      theme: "dark",
    });

    if (!newUser) {
      throw new ApiError(500, "Failed to create user");
    }

    console.log("✅ New User Created:", newUser._id);
    res
      .status(201)
      .cookie("token", firebaseSignUpUser.token, {
        httpOnly: true,
        sameSite: "None", // prevent by CSRF Attack
        secure: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .json(new ApiResponse(201, newUser));
  } catch (err) {
    console.error("❌ Error in MongoDB:", err.message);

    // If it's a validation error or duplicate key error, don't delete Firebase user
    if (err.code === 11000 || err.name === "ValidationError") {
      throw new ApiError(400, "User data validation failed");
    }

    // For other errors, clean up Firebase user
    try {
      await admin.auth().deleteUser(firebaseSignUpUser.uid);
      console.log("⛔ Firebase user deleted due to MongoDB error");
    } catch (firebaseDeleteErr) {
      console.error(
        "⚠️ Failed to delete Firebase user:",
        firebaseDeleteErr.message
      );
    }

    throw new ApiError(500, "Account creation failed");
  }
});

const signInController = wrapper(async (req, res) => {
  const firebaseSignUpUser = req.user;

  console.log("Firebase User:", firebaseSignUpUser);

  if (!firebaseSignUpUser || !firebaseSignUpUser.uid) {
    throw new ApiError(401, "Invalid Firebase authentication");
  }

  try {
    const existingUser = await User.findOne({ uid: firebaseSignUpUser.uid });

    if (existingUser) {
      return res
        .status(200)
        .cookie("token", firebaseSignUpUser.token, {
          httpOnly: true,
          sameSite: "None", // prevent by CSRF Attack
          secure: true,
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        })
        .json(new ApiResponse(200, existingUser));
    } else {
      throw new ApiError(400, "User Doesnt exist");
    }
  } catch (err) {
    console.error("❌ Error in MongoDB:", err.message);

    if (err.code === 11000 || err.name === "ValidationError") {
      throw new ApiError(400, "User data validation failed");
    }

    throw new ApiError(500, "Account creation failed");
  }
});

const logOutController = wrapper(async (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    })
    .json(new ApiResponse(200, "User logged out successfully"));
});

export { signUpController, signInController, logOutController };
