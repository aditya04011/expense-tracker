import React from 'react';

const ExpenseList = ({ expenses }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Category</th>
          <th>Description</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {expenses.length > 0 ? (
          expenses.map((expense) => (
            <tr key={expense._id}>
              <td>{new Date(expense.date).toLocaleDateString()}</td>
              <td>{expense.category}</td>
              <td>{expense.description}</td>
              <td>₹{expense.amount.toFixed(2)}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" style={{ textAlign: 'center' }}>No expenses found.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ExpenseList;
