const userMngtService = require("../service/userMngtService");

async function registerUser(req, res) {
  try {
    const registerResult = await userMngtService.register(req.body);
    if (registerResult.code == "11000") {
      res.status(200);
      res.json({
        message: "This Email address is already registered",
        registerResult,
      });
    }
    res.status(200);
    res.json(registerResult);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send({
      message: "User Not Created Successfully",
      error: error.message,
    });
  }
}

async function generateOtp(req, res) {
  try {
    const otpResponse = await userMngtService.generateOtp(req.body);
    res.status(200);
    res.json(otpResponse);
  } catch (error) {
    res.status(404);
    res.json(error);
  }
}

async function validateOtp(req, res){
  try {
    const validationResponse = await userMngtService.validateOtp(req.body);
    res.status(200);
    res.json(validationResponse);
  }catch(error){
    res.status(404);
    res.json(error);
  }
}

async function loginUser(req, res) {
  try {
    const loginResult = await userMngtService.login(req.body);
    res.status(200);
    res.json({ message: "Logging response", loginResult });
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
