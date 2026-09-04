import { body, param, query, validationResult } from "express-validator";

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  }
  next();
};

const passwordRule = body("password")
  .isString()
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long.")
  .matches(/[a-z]/)
  .withMessage("Password must contain a lowercase letter.")
  .matches(/[A-Z]/)
  .withMessage("Password must contain an uppercase letter.")
  .matches(/[0-9]/)
  .withMessage("Password must contain a number.");

const phoneRule = body("phone")
  .isString()
  .trim()
  .isMobilePhone("any")
  .withMessage("Enter a valid phone number.");

export const validateSignup = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email").trim().isEmail().withMessage("Enter a valid email address.").normalizeEmail(),
  passwordRule,
  phoneRule,
  body("gender").optional().isString(),
  handleValidation,
];

// Doctor records require gender, unlike patient records.
export const validateDoctorSignup = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email").trim().isEmail().withMessage("Enter a valid email address.").normalizeEmail(),
  passwordRule,
  phoneRule,
  body("gender").isString().notEmpty().withMessage("Gender is required."),
  handleValidation,
];

export const validateLogin = [
  body("email").trim().isEmail().withMessage("Enter a valid email address.").normalizeEmail(),
  body("password").isString().notEmpty().withMessage("Password is required."),
  handleValidation,
];

export const validateCreateAppointment = [
  body("doctorId").isString().notEmpty().withMessage("doctorId is required."),
  body("date").isISO8601().withMessage("date must be a valid ISO 8601 date (YYYY-MM-DD)."),
  body("time").matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("time must be in HH:mm 24-hour format."),
  handleValidation,
];

export const validateMongoIdParam = (paramName) => [
  param(paramName).isMongoId().withMessage(`Invalid ${paramName}.`),
  handleValidation,
];

export const validateContact = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email").trim().isEmail().withMessage("Enter a valid email address.").normalizeEmail(),
  body("subject").trim().notEmpty().withMessage("Subject is required."),
  body("message").trim().isLength({ min: 1, max: 5000 }).withMessage("Message is required."),
  handleValidation,
];

export const validatePagination = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer."),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100."),
  handleValidation,
];
