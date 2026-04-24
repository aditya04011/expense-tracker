import React from 'react';

const ExpenseTotal = ({ expenses }) => {
  const totalAmount = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  return (
    <div className="total">
      Total: ₹{totalAmount.toFixed(2)}
    </div>
  );
};

export default ExpenseTotal;
