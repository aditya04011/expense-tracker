import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../api';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseFilters from '../components/ExpenseFilters';
import ExpenseTotal from '../components/ExpenseTotal';
import Modal from '../components/Modal';

const Dashboard = () => {
  // State
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [filterCategory, setFilterCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('date_desc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Expenses
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/expenses', {
        params: {
          category: filterCategory,
          sort: sortOrder
        }
      });
      setExpenses(response.data);
    } catch (err) {
      setError('Failed to fetch expenses. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterCategory, sortOrder]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'amount') {
      if (/^00+/.test(value)) return;
      if (value === '0' && newExpense.amount === '0') return;
      setNewExpense(prev => ({ ...prev, [name]: value }));
    } else {
      setNewExpense(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const { amount, category, description, date } = newExpense;
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Amount must be a positive number greater than zero.");
      toast.error("Invalid Amount");
      return false;
    }
    if (!category.trim() || category.trim().length < 2) {
      setError("Category must be at least 2 characters long.");
      toast.error("Invalid Category");
      return false;
    }
    if (!description.trim() || description.trim().length < 2) {
      setError("Description must be at least 2 characters long.");
      toast.error("Invalid Description");
      return false;
    }
    if (!date) {
      setError("Please select a valid date.");
      toast.error("Invalid Date");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        ...newExpense,
        amount: parseFloat(newExpense.amount)
      };
      await api.post('/expenses', payload);
      
      toast.success("Expense added successfully!");
      setIsModalOpen(false); // Close modal on success

      setNewExpense({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      await fetchExpenses();
    } catch (err) {
      const msg = err.response?.data?.errors?.join(', ') || err.response?.data?.error || 'Failed to create expense.';
      setError(msg);
      toast.error(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Expense Tracker Dashboard</h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ Add Expense</button>
      </div>

      {error && <div className="error">{error}</div>}

      {/* Modal for adding expense */}
      <Modal 
        show={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New Expense"
      >
        <ExpenseForm 
          newExpense={newExpense} 
          handleInputChange={handleInputChange} 
          handleSubmit={handleSubmit} 
          loading={loading} 
        />
      </Modal>

      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>History</h2>
          <ExpenseTotal expenses={expenses} />
        </div>
        
        <ExpenseFilters 
          filterCategory={filterCategory} 
          setFilterCategory={setFilterCategory} 
          sortOrder={sortOrder} 
          setSortOrder={setSortOrder} 
          loading={loading} 
        />
        <ExpenseList expenses={expenses} />
      </section>
    </div>
  );
};

export default Dashboard;
