const Joi = require('joi');

const registerSchema = Joi.object({
  email : Joi.string().email().lowercase().required(),
  password_reg : Joi.string().min(6).required(),
  username_reg : Joi.string().required(),
  
})




module.exports = {
  registerSchema
}