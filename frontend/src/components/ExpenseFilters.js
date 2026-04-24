import React from 'react';

const ExpenseFilters = ({ filterCategory, setFilterCategory, sortOrder, setSortOrder, loading }) => {
  return (
    <div className="controls">
      <input
        type="text"
        placeholder="Filter by category..."
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
      />
      <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
        <option value="date_desc">Newest First</option>
        <option value="">No Sort</option>
      </select>
      {loading && <span className="loading">Loading...</span>}
    </div>
  );
};

export default ExpenseFilters;
