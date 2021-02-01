const jwt = require("jsonwebtoken"); // required for creation and validation of JWT
const dotenv = require("dotenv");
dotenv.config({ path: "./backend/config.env" });

module.exports = (req, res, next) => {
  try {
    // assuming we are sending the token in the 'Authorization' header as 'Bearer hsdhflsjdlfowoehle'
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // store email and userId from the decoded token to the 'req' object so that it will be available in the next middleware
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    // call next middleware on successful verification
    next();
  } catch (error) {
    res.status(401).json({
      message: "Auth Failed",
    });
  }
};
