const jwt = require("jsonwebtoken");

exports.createToken = (user, secret, expiresIn) => {
  const { id, email, name, lastname, role } = user;
  return jwt.sign(
    {
      id,
      email,
      name,
      lastname,
      role,
    },
    secret,
    { expiresIn }
  );
};
