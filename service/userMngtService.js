const db = require("../model/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const secret = crypto.randomBytes(64).toString("hex");
const secret_key = process.env.SECRET_KEY;
const axios = require("axios");

const register = async (jsonBody) => {
  const { name, mobileNumber, password, otp } = jsonBody;
  const storedOtpData = otpStore[mobileNumber];
  const salt = await bcrypt.genSalt(10);
  const pass = await bcrypt.hash(password, salt);
  const userDate = {
    name: name,
    mobileNumber: mobileNumber,
    role: "user",
    password: pass,
    createdBy: name,
    updatedBy: name,
  };

  try {
    if (!storedOtpData) {
      return { valid: false, message: "OTP not found" };
    }
    const { otp: storedOtp, expires } = storedOtpData;
    if (Date.now() > expires) {
      delete otpStore[mobileNumber];
      return { valid: false, message: "OTP has expired" };
    }
    if (storedOtp !== otp) {
      return { valid: false, message: "Invalid OTP" };
    }

    delete otpStore[mobileNumber];
    const checking = db.user(userDate);
    const user = await checking.save();
    const result = { valid: true, message: "OTP confirmed" };
    return result;
  } catch (error) {
    console.log(error.errorResponse);
    return error.errorResponse;
  }
};

const generateOtp = async (jsonBody) => {
  const { mobileNumber } = jsonBody;
  try {
    const existingUser = await db.user.findOne({ mobileNumber: mobileNumber  });
    console.log('000---',existingUser);
    if (existingUser) {
      return { message: "Mobile number is already registered" };
    }
    const otp = generateAndStoreOTP(mobileNumber);
    const apiPayload = {
      apiKey:
        process.env.W_API_KEY,
      campaignName: "website",
      destination: mobileNumber,
      userName: "User", // Provide a default value if userName is not provided
      templateParams: [
        otp,
        "Vaibhav",
        mobileNumber,
        "@gmail.com",
        "Valid for 5 min",
      ],
    };

    const response = await axios.post(
      "https://backend.aisensy.com/campaign/t1/api/v2",
      apiPayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      message: "OTP generated and sent to your WhatsApp number",
      data: response.data,
    };
  } catch (error) {
    return error;
  }
};

const login = async (jsonBody) => {
  const { mobileNumber, password } = jsonBody;
  try {
    const user = await db.user.findOne({ mobileNumber });
    console.log(user);
    if (!user) {
      return { message: "User not found", status: false };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { message: "Invalid password", status: false };
    }
    const token = jwt.sign(
      { id: user._id, mobileNumber: user.mobileNumber, role: user.role },
      secret_key,
      { expiresIn: "1h" }
    );
    return { message: token, status: true };
  } catch (error) {
    return error;
  }
};

const otpStore = {};

const generateAndStoreOTP = (mobileNumber) => {
  const otp = generateOTP();
  const expires = Date.now() + 5 * 60 * 1000; // OTP is valid for 5 minutes
  otpStore[mobileNumber] = { otp, expires };
  return otp;
};

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

module.exports = {
  register,
  generateOtp,
  login,
};
