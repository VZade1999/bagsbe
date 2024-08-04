const db = require("../model/index");
const fs = require("node:fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret_key = process.env.SECRET_KEY;
const axios = require("axios");
// const sendEmail = require("./mailer");
const { validate } = require("../model/category");

const register = async (jsonBody) => {
  const { name, email, password } = jsonBody;
  const salt = await bcrypt.genSalt(10);
  const pass = await bcrypt.hash(password, salt);
  const userDate = {
    name: name,
    email: email,
    role: "user",
    password: pass,
    createdBy: name,
    updatedBy: name,
  };

  try {
    const checking = db.user(userDate);
    const user = await checking.save();
    return {
      status: true,
      message: "User Registered Successfully",
    };
  } catch (error) {
    if (error.code === 11000) {
      return {
        status: false,
        message: "This Email address is already registered",
      };
    }
  }
};

const generateOtp = async (jsonBody) => {
  const { email } = jsonBody;
  try {
    const existingUser = await db.user.findOne({ email: email });
    if (existingUser) {
      return {
        valid: false,
        message: "Email address is already register",
      };
    }
    const otp = generateAndStoreOTP(email);
    const templatePath = path.join(__dirname, "./verificationCode.html");
    const template = fs.readFileSync(templatePath, "utf8");
    const renderTemplate = (template, variables) => {
      return template.replace(/{{(\w+)}}/g, (_, key) => variables[key] || "");
    };

    const emailSubject = "Verification code";
    const templateVariables = { otp: otp };
    const mainData = renderTemplate(template, templateVariables);
    try {
      const res = await sendEmail(email, emailSubject, mainData);
      return {
        valid: true,
        message: res,
      };
    } catch (error) {
      console.log(error);
      return {
        valid: false,
        message: "Internal Server Error",
      };
    }
  } catch (error) {
    return {
      valid: false,
      message: "Internal Server Error",
    };
  }
};

const validateOtp = async (jsonBody) => {
  const { email, otp } = jsonBody;
  const storedOtpData = otpStore[email];
  try {
    if (!storedOtpData) {
      return { valid: false, message: "OTP not found" };
    }
    const { otp: storedOtp, expires } = storedOtpData;
    if (Date.now() > expires) {
      delete otpStore[email];
      return { valid: false, message: "OTP has expired" };
    }
    if (storedOtp !== otp) {
      return {
        valid: false,
        message: "Invalid OTP",
      };
    }
    delete otpStore[email];
    return {
      valid: true,
      message: "OTP validated Successfully",
    };
  } catch (error) {
    return error.errorResponse;
  }
};

const login = async (jsonBody) => {
  const { email, password } = jsonBody;
  try {
    const user = await db.user.findOne({ email });
    if (!user) {
      return { message: "User not found", status: false };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { message: "Invalid password", status: false };
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      secret_key,
      { expiresIn: "1h" }
    );
    return { message: token, status: true };
  } catch (error) {
    return error;
  }
};

const otpStore = {};

const generateAndStoreOTP = (email) => {
  const otp = generateOTP();
  const expires = Date.now() + 5 * 60 * 1000; // OTP is valid for 5 minutes
  otpStore[email] = { otp, expires };
  return otp;
};

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

module.exports = {
  register,
  generateOtp,
  login,
  validateOtp,
};
