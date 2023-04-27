const express = require("express");
const xss = require("xss");
const authValidations = require("../helpers/authValidations");
const data = require("../data");

const router = express.Router();
const authData = data.authData;
const LOGIN_SOURCE_GOOGLE = "google";

router.route("/signup").post(async (req, res) => {
  console.log('here?')
  let errors = {};

  if (req.session.user) {
    errors.other = "You are already logged in.";
    errors.code = 403;
    return res.status(errors.code).json(errors);
  }

  let firstName = xss(req.body.firstName).trim();
  let lastName = xss(req.body.lastName).trim();
  let email = xss(req.body.email).trim();
  let username = xss(req.body.username).trim();
  let password = xss(req.body.password).trim();
  let confirmPassword = xss(req.body.confirmPassword).trim();
  let source = xss(req.body.source).trim();

  try {
    authValidations.validateCreateUserData(
      firstName,
      lastName,
      email,
      username,
      password,
      confirmPassword,
      source,
      errors
    );
  } catch (exception) {
    let code = 400;
    if (exception.code) {
      code = exception.code;
    }
    return res.status(code).json(exception);
  }

  try {
    let user = await authData.createUser(
      firstName,
      lastName,
      email,
      username,
      password,
      confirmPassword,
      source
    );
    if (user && user.data) {
      delete user.data.password;
      return res.status(user.code).json(user.data);
    } else {
      return res
        .status(500)
        .json({
          other:
            "Can not create user at this moment please try after some time.",
        });
    }
  } catch (exception) {
    let code = 400;
    if (exception.code) {
      code = exception.code;
    }
    return res.status(code).json(exception);
  }
});

router.route("/login").post(async (req, res) => {
  let errors = {};
  if (req.session.user) {
    errors.other = "You are already logged in.";
    errors.code = 403;
    return res.status(errors.code).json(errors);
  }

  let email = xss(req.body.email).trim();
  let password = xss(req.body.password).trim();
  let source = xss(req.body.source).trim();

  if (source === LOGIN_SOURCE_GOOGLE) {
    return res.status(307).location("/auth/login/google").send(req.body);
  }
  try {
    authValidations.validateAuthenticateUser(email, password, source, errors);
  } catch (exception) {
    let code = 403;
    if (exception.code) {
      code = exception.code;
    }
    return res.status(code).json(exception);
  }

  try {
    let user = await authData.authenticateUser(email, password, source);
    if (user && user.data) {
      delete user.data.password;
      req.session.user = user.data;
      user.data.token = req.session.id;
      return res.status(200).json(user.data);
    } else {
      return res
        .status(500)
        .json({
          other:
            "Can not log you in at this moment. Please try after some time.",
        });
    }
  } catch (exception) {
    let code = 400;
    if (exception.code) {
      code = exception.code;
    }
    return res.status(code).json(exception);
  }
});

router.route("/login/google").post(async (req, res) => {
  let errors = {};
  let email = xss(req.body.email).trim();
  let source = xss(req.body.source).trim();
  let displayName = xss(req.body.displayName).trim();

  try {
    authValidations.validateGoogleLoginData(email, displayName, source, errors);
  } catch (exception) {
    let code = 403;
    if (exception.code) {
      code = exception.code;
    }
    return res.status(code).json(exception);
  }

  try {
    let user = await authData.authenticateGoogleUser(
      email,
      displayName,
      source
    );
    if (user && user.data) {
      delete user.data.password;
      req.session.user = user.data;
      user.data.token = req.session.id;
      return res.status(200).json(user.data);
    } else {
      return res
        .status(500)
        .json({
          other:
            "Can not log you in at this moment. Please try after some time.",
        });
    }
  } catch (exception) {
    let code = 400;
    if (exception.code) {
      code = exception.code;
    }
    return res.status(code).json(exception);
  }
});

router.route("/logout").get(async (req, res) => {
  if (req.session.user) {
    req.session.destroy();
    return res.status(200).json({ message: "You have been logged out." });
  } else {
    return res.status(403).json({ other: "You are not logged in." });
  }
});


module.exports = router;
