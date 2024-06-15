const secret_key = process.env.SECRET_KEY
const jwt = require("jsonwebtoken");
exports.validateAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      try {
        jwt.verify(token, secret_key, (err, decoded) => {
          if (err) {
            console.log(err);
              return res.status(401).json('Invalid token');
          }
        if (decoded) {
          next();
        }})
        
      } catch (error) {
        
        res.status(404);
        res.json({ message: "Invalid token !" });
      }
    } else {
      res.status(401);
      res.json({ message: "No token provided." });
    }
  }

  return {mesaage: "chnge"}
};
