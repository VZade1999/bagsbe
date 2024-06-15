const userMngtService = require("../service/userMngtService");

async function registerUser(req, res) {
  try {
    const registerResult = await userMngtService.register(req.body);
    if (registerResult.code == "11000") {
      res.status(200);
      res.json({
        message: "This What's App number is already registered",
        registerResult,
      });
    }
    res.status(200);
    res.json(registerResult );
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
    const loginResult = await userMngtService.generateOtp(req.body);
    res.status(200);
    res.json({ message: "OTP Response", loginResult });
  } catch (error) {
    res.status(404);
    res.json(error);
  }
}
async function validation(req, res) {
  try {
    res.status(200);
    res.json({ isValid: true });
  } catch (error) {
    res.status(404);
    res.json({ isValid: false });
  }
}

async function validationUser(req, res) {
  try {
    const loginResult = await userMngtService.validation(req.body);
    res.status(200);
    res.json({ message: "User Logged Successfully", loginResult });
  } catch (error) {
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
  validationUser,
  loginUser,
  validation
};
