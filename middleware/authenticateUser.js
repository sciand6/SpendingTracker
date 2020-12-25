const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next) => {
  let { authorization } = req.headers;
  let token = null;
  // For Postman
  if (authorization) {
    token = authorization.replace("Bearer ", "");
  }
  // For the react native application
  if (req.headers["x-auth"]) {
    authorization = req.headers["x-auth"];
    token = authorization;
  }

  if (!authorization) {
    return res.status(401).json({ msg: "You must be logged in." });
  }
  jwt.verify(token, process.env.JWTSecret, (err, payload) => {
    if (err) {
      return res.status(401).json({ msg: "You must be logged in." });
    }
    const { _id } = payload;
    User.findById(_id).then((userdata) => {
      req.user = userdata;
      next();
    });
  });
};
