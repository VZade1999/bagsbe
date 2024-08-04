const userMngtService = require("../service/userMngtService");

async function registerUser(req, res) {
  try {
    const registerResult = await userMngtService.register(req.body);
    res.status(200);
    res.json(registerResult);
  } catch (error) {
    res.status(500);
    res.json(error);
  }
}

async function generateOtp(req, res) {
  try {
    const otpResponse = await userMngtService.generateOtp(req.body);
    res.status(200);
    res.json(otpResponse);
  } catch (error) {
    console.log("error", error);
    res.status(404);
    res.json(error);
  }
}

async function validateOtp(req, res) {
  try {
    const validationResponse = await userMngtService.validateOtp(req.body);
    res.status(200);
    res.json(validationResponse);
  } catch (error) {
    res.status(404);
    res.json(error);
  }
}

async function loginUser(req, res) {
  try {
    const loginResult = await userMngtService.login(req.body);
    res.status(200);
    res.json(loginResult);
  } catch (error) {
    res.status(404);
    res.json(error);
  }
}

module.exports = {
  registerUser,
  generateOtp,
  loginUser,
  validateOtp,
};
