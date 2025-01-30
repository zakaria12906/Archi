// src/middlewares/validate.middleware.js
const Joi = require('joi');

/**
 * Middleware générique pour valider req.body avec un schéma Joi
 */
function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
}

// --- Définition des schémas JOI --- //

/**
 * signupSchema :
 *  - login: email format
 *  - password: min 6 caractères
 *  - firstname, lastname: optionnel
 *  - role: optionnel
 */
const signupSchema = Joi.object({
  login: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstname: Joi.string().optional().allow(''),
  lastname: Joi.string().optional().allow(''),
  role: Joi.string().optional().allow('')
});

/**
 * loginSchema :
 *  - login: email
 *  - password: min 6
 */
const loginSchema = Joi.object({
  login: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

/**
 * refreshSchema :
 *  - refreshToken: string
 */
const refreshSchema = Joi.object({
  refreshToken: Joi.string().required()
});

/**
 * forgotPasswordSchema :
 *  - login: email
 */
const forgotPasswordSchema = Joi.object({
  login: Joi.string().email().required()
});

/**
 * resetPasswordSchema :
 *  - token: string
 *  - newPassword: min 6
 */
const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

module.exports = {
  validate,
  signupSchema,
  loginSchema,
  refreshSchema,
  forgotPasswordSchema,
  resetPasswordSchema
};

