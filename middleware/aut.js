const secret_key = 'd5791705cb7deda06bf36b4abd9f5e76209fd7fa2ff8946606b0e2f61432c050d35c8ebda460ffa03d86efaa7b53d021fd67c71f9307613e2c3bae0dc5ec72e7';
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
