import React from 'react';

const ExpenseForm = ({ newExpense, handleInputChange, handleSubmit, loading }) => {
  return (
    <section>
      <h2>Add New Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Amount (₹)</label>
          <input
            type="number"
            name="amount"
            step="0.01"
            value={newExpense.amount}
            onChange={handleInputChange}
            placeholder="0.00"
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={newExpense.category}
            onChange={handleInputChange}
            placeholder="e.g. Food, Transport"
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={newExpense.description}
            onChange={handleInputChange}
            placeholder="What was this for?"
            required
          />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={newExpense.date}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Add Expense'}
        </button>
      </form>
    </section>
  );
};

export default ExpenseForm;
