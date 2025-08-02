import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Github, ArrowRight, Zap } from "lucide-react";
import { useThemeStore } from "../store/slices/useThemeStore";
import CryptoJs from "crypto-js";
import Header from "../components/Header";
import AuthAnimation from "../components/AuthAnimation";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLoaders } from "../store/slices/useLoaders.js";
import { useIsAuth } from "../store/slices/useIsAuth.js";
import { useUserStore } from "../store/slices/useUserStore.js";
import { app } from "../firebase/firebase.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { signInApi } from "../api/signIn.js";
import  SuccessNotification  from "../components/SuccessNotification.jsx";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const theme = useThemeStore((state) =>
    CryptoJs.AES.decrypt(
      state.mode,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString(CryptoJs.enc.Utf8)
  );
  const auth = getAuth(app);
  const username = useUserStore((state) => state.username);
  const email = useUserStore((state) => state.email);
  const photoURL = useUserStore((state) => state.photoURL);
  const loginUser = useUserStore((state) => state.loginUser);
  const isPremium = useUserStore((state) => state.isPremium);

  const isLoading = useLoaders((state) => state.loader);
  const setLoader = useLoaders((state) => state.setLoader);
  const unsetLoader = useLoaders((state) => state.unsetLoader);
  const googleLoader = useLoaders((state) => state.googleLoader);
  const setGoogleLoader = useLoaders((state) => state.setGoogleLoader);
  const unsetGoogleLoader = useLoaders((state) => state.unsetGoogleLoader);
  const githubLoader = useLoaders((state) => state.githubLoader);
  const setGithubLoader = useLoaders((state) => state.setGithubLoader);
  const unsetGithubLoader = useLoaders((state) => state.unsetGithubLoader);
  const setAuth = useIsAuth((state) => state.setAuth);
  const isAuth = useIsAuth((state) => state.isAuth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader();

    try {
      if (!validateForm()) {
        unsetLoader();
        return;
      }

      console.log(`Email: ${formData.email} , password: ${formData.password}`);

      const firebaseResponse = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const token = await firebaseResponse.user.getIdToken();

      const apiResponse = await signInApi({ token });
      console.log(apiResponse);

      if (apiResponse.status !== 201 && apiResponse.status !== 200) {
        await firebaseResponse.user.delete();
        alert("Error signing in. Please try again.");
        return;
      }

      setAuth();
      loginUser({
        username: apiResponse.data.username,
        email: apiResponse.data.email,
        photoURL: apiResponse.data.photoURL,
        bio: apiResponse.data.bio,
        isPremium: apiResponse.data.isPremium,
      });
      
      // Set welcome message for dashboard
      localStorage.setItem('welcomeUser', JSON.stringify({
        username: apiResponse.data.username,
        type: 'signin'
      }));
      
      navigate("/dashboard");
    } catch (err) {
      console.log("Error in Sign In", err);
      alert("Sign in failed. Please try again.");
    } finally {
      unsetLoader();
      setFormData({
        email: "",
        password: "",
      });
    }
  };

  const signInWithGoogle = async (e) => {
    let firebaseResponse = null;
    try {
      unsetGoogleLoader();
      setGoogleLoader();

      // Create GoogleAuthProvider with custom parameters to ensure popup stays open
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });

      // Use signInWithPopup with explicit error handling
      firebaseResponse = await signInWithPopup(auth, provider);

      if (!firebaseResponse || !firebaseResponse.user) {
        throw new Error("Google authentication failed");
      }

      const token = await firebaseResponse.user.getIdToken();

      const apiResponse = await signInApi({
        token,
      });

      if (apiResponse.status !== 200 && apiResponse.status !== 201) {
        await firebaseResponse.user.delete();
        alert("Error creating account. Please try again.");
        return;
      }

      setAuth();
      loginUser({
        username: apiResponse.data.username,
        email: apiResponse.data.email,
        photoURL: apiResponse.data.photoURL,
        bio: apiResponse.data.bio,
        isPremium: apiResponse.data.isPremium,
      });
      
      // Set welcome message for dashboard (Google)
      localStorage.setItem('welcomeUser', JSON.stringify({
        username: apiResponse.data.username,
        type: 'signin'
      }));
      
      navigate("/dashboard");
    } catch (err) {
      console.error("Google signup error:", err);

      // Handle specific Firebase Auth errors
      if (err.code === "auth/popup-closed-by-user") {
        alert("Sign-up cancelled. Please try again.");
      } else if (err.code === "auth/popup-blocked") {
        alert("Popup was blocked. Please allow popups for this site.");
      } else if (err.code === "auth/cancelled-popup-request") {
        // This happens when multiple popups are opened, ignore silently
        console.log("Popup request cancelled");
      } else {
        alert("Google sign-in failed. Please try again.");
      }

      // Clean up Firebase user if it was created
      if (firebaseResponse?.user) {
        try {
          await firebaseResponse.user.delete();
        } catch (deleteErr) {
          console.error("Error deleting Firebase user:", deleteErr);
        }
      }
    } finally {
      unsetGoogleLoader();
    }
  };

  const signInWithGithub = async (e) => {
    let firebaseResponse = null;
    try {
      unsetGithubLoader();
      setGithubLoader();

      // Create GoogleAuthProvider with custom parameters to ensure popup stays open
      const provider = new GithubAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });

      // Use signInWithPopup with explicit error handling
      firebaseResponse = await signInWithPopup(auth, provider);

      if (!firebaseResponse || !firebaseResponse.user) {
        throw new Error("Google authentication failed");
      }

      const token = await firebaseResponse.user.getIdToken();

      const apiResponse = await signInApi({
        token,
      });

      if (apiResponse.status !== 200 && apiResponse.status !== 201) {
        await firebaseResponse.user.delete();
        alert("Error creating account. Please try again.");
        return;
      }

      setAuth();
      loginUser({
        username: apiResponse.data.username,
        email: apiResponse.data.email,
        photoURL: apiResponse.data.photoURL,
        bio: apiResponse.data.bio,
        isPremium: apiResponse.data.isPremium,
      });
      
      // Set welcome message for dashboard (GitHub)
      localStorage.setItem('welcomeUser', JSON.stringify({
        username: apiResponse.data.username,
        type: 'signin'
      }));
      
      navigate("/dashboard");
    } catch (err) {
      console.error("Google signup error:", err);

      // Handle specific Firebase Auth errors
      if (err.code === "auth/popup-closed-by-user") {
        alert("Sign-up cancelled. Please try again.");
      } else if (err.code === "auth/popup-blocked") {
        alert("Popup was blocked. Please allow popups for this site.");
      } else if (err.code === "auth/cancelled-popup-request") {
        // This happens when multiple popups are opened, ignore silently
        console.log("Popup request cancelled");
      } else {
        alert("Github sign-In failed. Please try again.");
      }

      // Clean up Firebase user if it was created
      if (firebaseResponse?.user) {
        try {
          await firebaseResponse.user.delete();
        } catch (deleteErr) {
          console.error("Error deleting Firebase user:", deleteErr);
        }
      }
    } finally {
      unsetGithubLoader();
    }
  };

  const isDark = theme === "dark";

  return (
    <>
      <Header />
      <div
        className={`min-h-screen transition-all duration-500 ${
          isDark
            ? "bg-gray-900 text-white"
            : "bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900"
        }`}
      >
        <div className="container mx-auto px-4 py-8 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Side - Animation Component */}
            <AuthAnimation
              title="Welcome Back to Your"
              subtitle="Continue your AI-powered learning journey with StudySync AI's powerful study tools."
            />

            {/* Right Side - SignIn Form */}
            <div className="order-1 lg:order-2">
              <div
                className={`max-w-lg mx-auto p-8 lg:p-12 rounded-3xl shadow-2xl backdrop-blur-lg border ${
                  isDark
                    ? "bg-gray-800/90 border-gray-700 shadow-black/50"
                    : "bg-white/95 border-gray-200 shadow-gray-500/20"
                }`}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center space-x-3 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h2
                    className={`text-3xl font-bold mb-3 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Welcome Back
                  </h2>
                  <p
                    className={`text-lg ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Sign in to continue your learning journey
                  </p>
                </div>

                {/* Social Login */}
                <div className="space-y-4 mb-8">
                  <button
                    className={`w-full py-4 px-6 rounded-2xl border-2 flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                      isDark
                        ? "border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-white"
                        : "border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700"
                    } hover:shadow-xl`}
                    onClick={signInWithGoogle}
                    disabled={googleLoader}
                  >
                    {googleLoader ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
                        <span>Signing up...</span>
                      </div>
                    ) : (
                      <>
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        <span>Continue with Google</span>
                      </>
                    )}
                  </button>

                  <button
                    className={`w-full py-4 px-6 rounded-2xl border-2 flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                      isDark
                        ? "border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-white"
                        : "border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700"
                    } hover:shadow-xl`}
                    onClick={signInWithGithub}
                    disabled={githubLoader}
                  >
                    {githubLoader ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
                        <span>Signing up...</span>
                      </div>
                    ) : (
                      <>
                        {/* GitHub SVG Icon */}
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.112.793-.262.793-.583v-2.234c-3.338.726-4.033-1.61-4.033-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.808 1.304 3.492.997.108-.776.42-1.305.763-1.605-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.468-2.382 1.235-3.222-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.29-1.552 3.296-1.23 3.296-1.23.653 1.653.241 2.873.119 3.176.77.84 1.233 1.912 1.233 3.222 0 4.61-2.804 5.624-5.475 5.921.431.37.816 1.102.816 2.222v3.293c0 .324.192.699.801.58C20.565 21.796 24 17.296 24 12c0-6.63-5.373-12-12-12z" />
                        </svg>
                        <span>Continue with GitHub</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div className="relative mb-8">
                  <div className={`absolute inset-0 flex items-center`}>
                    <div
                      className={`w-full border-t-2 ${
                        isDark ? "border-gray-600" : "border-gray-300"
                      }`}
                    ></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span
                      className={`px-6 py-2 rounded-full text-sm font-medium ${
                        isDark
                          ? "bg-gray-800 text-gray-400"
                          : "bg-white text-gray-500"
                      }`}
                    >
                      Or continue with email
                    </span>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label
                      className={`block text-sm font-semibold mb-3 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        className={`absolute left-4 top-4 w-5 h-5 ${
                          isDark ? "text-gray-400" : "text-gray-400"
                        }`}
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        autoComplete="email"
                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 ${
                          errors.email
                            ? "border-red-500 focus:border-red-500"
                            : isDark
                            ? "border-gray-600 bg-gray-700 text-white focus:border-emerald-500"
                            : "border-gray-300 bg-white text-gray-900 focus:border-emerald-500"
                        } text-lg`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-2 font-medium">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label
                        className={`text-sm font-semibold ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Password
                      </label>
                      <a
                        href="#"
                        className="text-emerald-500 hover:text-emerald-600 text-sm font-medium underline"
                      >
                        Forgot Password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock
                        className={`absolute left-4 top-4 w-5 h-5 ${
                          isDark ? "text-gray-400" : "text-gray-400"
                        }`}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        autoComplete="current-password"
                        className={`w-full pl-12 pr-14 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 ${
                          errors.password
                            ? "border-red-500 focus:border-red-500"
                            : isDark
                            ? "border-gray-600 bg-gray-700 text-white focus:border-emerald-500"
                            : "border-gray-300 bg-white text-gray-900 focus:border-emerald-500"
                        } text-lg`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-4 top-4 ${
                          isDark
                            ? "text-gray-400 hover:text-gray-300"
                            : "text-gray-400 hover:text-gray-600"
                        } transition-colors`}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-2 font-medium">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-5 h-5 text-emerald-500 border-gray-300 rounded-lg focus:ring-emerald-500 focus:ring-2"
                    />
                    <label
                      htmlFor="rememberMe"
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Remember me for 30 days
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-6 h-6" />
                      </>
                    )}
                  </button>
                </form>

                {/* Sign Up Link */}
                <p
                  className={`text-center mt-8 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Don't have an account?{" "}
                  <Link to={"/signup"}>
                    <button className="text-emerald-500 hover:text-emerald-600 font-semibold underline">
                      Sign Up
                    </button>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
