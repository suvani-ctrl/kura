import Joi from 'joi';

export const signupSchema = Joi.object({
    email: Joi.string()
        .email()
        .max(255)
        .required()
        .messages({
            'string.email': 'Invalid email format',
            'string.max': 'Email too long',
            'any.required': 'Email is required'
        }),
    username: Joi.string()
        .min(3)
        .max(32)
        .trim()
        .required()
        .messages({
            'string.min': 'Username must be at least 3 characters',
            'string.max': 'Username too long'
        }),
    password: Joi.string()
        .min(10)
        .required()
        .messages({
            'string.min': 'Password must be at least 10 characters'
        }),
    profilePic: Joi.string().uri().optional()
});

export const loginSchema = Joi.object({
    email: Joi.string().email().optional(),
    username: Joi.string().optional(),
    password: Joi.string().required()
}).or('email', 'username'); // At least one must be present

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().optional(),
    username: Joi.string().optional()
}).or('email', 'username');

export const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    userId: Joi.string().required(),
    newPassword: Joi.string().min(10).required()
});

export const updateProfileSchema = Joi.object({
    profilePic: Joi.string().required()
});