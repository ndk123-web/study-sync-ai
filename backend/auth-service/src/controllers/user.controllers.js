import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import wrapper from "../utils/Wrapper.js";
import User from "../models/user.models.js";
import admin from "firebase-admin"; // make sure this is configured

const signUpController = wrapper(async (req, res) => {
  const firebaseSignUpUser = req.user;
  console.log("Firebase User Express: ", firebaseSignUpUser);

  try {
    const isExistUser = await User.findOne({ uid: firebaseSignUpUser.uid });
    if (isExistUser) {
      throw new ApiError(400, "User already registered");
    }

    const newUser = await User.create({
      uid: firebaseSignUpUser.uid,
      username: firebaseSignUpUser.name || firebaseSignUpUser.email,
      photoURL: firebaseSignUpUser.picture,
      email: firebaseSignUpUser.email,
      theme: "dark",
    });

    if (!newUser) {
      throw new ApiError(500, "Can not create new user");
    }

    console.log("✅ New User Created");
    res.status(201).json(new ApiResponse(201, newUser));
  } catch (err) {
    // Important: Delete Firebase user if MongoDB insertion fails
    try {
      await admin.auth().deleteUser(firebaseSignUpUser.uid);
      console.log("⛔ Firebase user deleted due to MongoDB error.");
    } catch (firebaseDeleteErr) {
      console.error("⚠️ Failed to delete Firebase user:", firebaseDeleteErr.message);
    }

    console.error("❌ Error in MongoDB:", err.message);
    throw new ApiError(400, "Error in MongoDB");
  }
});

export { signUpController };
