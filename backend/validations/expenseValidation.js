const Joi = require('joi');

/**
 * Validation schema for creating a new expense.
 */
const createExpenseSchema = Joi.object({
    amount: Joi.number().positive().precision(2).required().messages({
        'number.base': 'Amount must be a number',
        'number.positive': 'Amount must be greater than zero',
        'any.required': 'Amount is required'
    }),
    category: Joi.string().trim().min(2).max(50).required().messages({
        'string.min': 'Category must be at least 2 characters long',
        'any.required': 'Category is required'
    }),
    description: Joi.string().trim().min(2).max(255).required().messages({
        'string.min': 'Description must be at least 2 characters long',
        'any.required': 'Description is required'
    }),
    date: Joi.date().iso().required().messages({
        'date.format': 'Date must be a valid ISO 8601 string',
        'any.required': 'Date is required'
    })
});

/**
 * Validation schema for GET /expenses query parameters.
 */
const getExpensesQuerySchema = Joi.object({
    category: Joi.string().trim().allow('').optional(),
    sort: Joi.string().valid('date_desc').allow('').optional().messages({
        'any.only': 'Sort must be date_desc'
    })
});

module.exports = {
    createExpenseSchema,
    getExpensesQuerySchema
};
