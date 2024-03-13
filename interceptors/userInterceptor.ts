export { }
module.exports = {
  validateUser: validateUser,
  loginUser: loginUser
};

function validateUser(req, res, next) {
  let email = req.body.email;
  if (email && email !== "") {
    next();
  } else {
    res.send({
      message: "Required field/s missing.",
    });
  }
}

function loginUser(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  if (email && email !== "" && password && password !== "") {
    next();
  } else {
    res.send({
      message: "Required field/s missing.",
    });
  }
}
