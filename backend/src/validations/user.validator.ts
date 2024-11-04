import { checkSchema } from "express-validator";

export const addUserValidate = checkSchema({
  password: {
    isLength: {
      errorMessage: "Password should be at least 7 chars long",
      options: { min: 7 },
    },
  },
  email: {
    isEmail: {
      errorMessage: "Invalid Email",
      bail: true,
    },
  },
  name: {
    isString: {
      errorMessage: "Invalid name",
    },
  },
});

export const loginUserValidate = checkSchema({
  email: {
    isEmail: {
      errorMessage: "Invalid email",
      bail: true,
    },
  },
  password: {
    isLength: {
      errorMessage: "Password should be at least 7 chars long",
      options: { min: 7 },
    },
  },
});

export const updatePasswordValidate = checkSchema({
  password: {
    isLength: {
      errorMessage: "Password should be at least 7 chars long",
      options: { min: 7 },
    },
  },
});

module.exports = { addUserValidate, loginUserValidate, updatePasswordValidate };
