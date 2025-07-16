import { useState, useEffect } from "react";
import { transactionService } from "@/services/api/transactionService";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData) => {
    try {
      const newTransaction = await transactionService.create(transactionData);
      setTransactions(prev => [newTransaction, ...prev]);
      return newTransaction;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const updateTransaction = async (id, transactionData) => {
    try {
      const updatedTransaction = await transactionService.update(id, transactionData);
      setTransactions(prev => prev.map(t => t.Id === id ? updatedTransaction : t));
      return updatedTransaction;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await transactionService.delete(id);
      setTransactions(prev => prev.filter(t => t.Id !== id));
    } catch (err) {
      throw new Error(err.message);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    loadTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
};