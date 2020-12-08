const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ msg: "You must be logged in." });
  }
  const token = authorization.replace("Bearer ", "");
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
