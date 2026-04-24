const Expense = require('../models/Expense');
const ProcessedRequest = require('../models/ProcessedRequest');
const { createExpenseSchema, getExpensesQuerySchema } = require('../validations/expenseValidation');

/**
 * Handle expense creation with idempotency and validation.
 */
const createExpense = async (req, res) => {
    const requestId = req.headers['x-request-id'];

    try {
        // 1. Joi Validation
        const { error, value } = createExpenseSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json({ errors: errorMessages });
        }

        // 2. Idempotency Check
        if (requestId) {
            const existingRequest = await ProcessedRequest.findOne({ requestId });
            if (existingRequest) {
                return res.status(200).json({ message: "Request already processed successfully." });
            }
        } else {
            console.warn('Warning: X-Request-Id header is missing.');
        }

        // 3. Database Operations
        // Create the Expense
        const expense = await Expense.create(value);

        // Record the Processed Request
        if (requestId) {
            await ProcessedRequest.create({ requestId });
        }

        return res.status(201).json(expense);
    } catch (dbError) {
        console.error('Database Error:', dbError);
        return res.status(500).json({ error: "An error occurred while processing the request." });
    }
};

/**
 * Handle expense retrieval with filtering and sorting.
 */
const getExpenses = async (req, res) => {
    try {
        // 1. Query Parameter Validation
        const { error, value } = getExpensesQuerySchema.validate(req.query);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // 2. Build MongoDB Query
        const queryObj = {};
        if (value.category) {
            queryObj.category = { $regex: new RegExp(value.category, 'i') };
        }

        // 3. Apply Sorting and Execute
        let query = Expense.find(queryObj);
        if (value.sort === 'date_desc') {
            query = query.sort({ date: -1 });
        }

        const expenses = await query.exec();
        return res.status(200).json(expenses);
    } catch (error) {
        console.error('Fetch Error:', error);
        return res.status(500).json({ error: "An error occurred while fetching expenses." });
    }
};

module.exports = {
    createExpense,
    getExpenses
};
