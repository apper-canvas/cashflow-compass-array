import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Transactions from "@/components/pages/Transactions";
import CategoryIcon from "@/components/molecules/CategoryIcon";
import DateRangePicker from "@/components/molecules/DateRangePicker";
import FormField from "@/components/molecules/FormField";
import SearchBar from "@/components/molecules/SearchBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { accountService } from "@/services/api/accountService";
import { transactionService } from "@/services/api/transactionService";
import { categoryService } from "@/services/api/categoryService";
import { formatCurrency, formatDate } from "@/utils/formatters";
const TransactionList = ({ showActions = true, limit }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [updating, setUpdating] = useState(false);
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [transactionsData, categoriesData, accountsData] = await Promise.all([
        transactionService.getAll(),
        categoryService.getAll(),
        accountService.getAll()
      ]);
      
      setTransactions(transactionsData);
      setCategories(categoriesData);
      setAccounts(accountsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

const handleEditTransaction = (transaction) => {
    setEditingId(transaction.Id);
    setEditFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      description: transaction.description,
      categoryId: transaction.categoryId.toString(),
      accountId: transaction.accountId.toString(),
      date: transaction.date
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleUpdateTransaction = async (id) => {
    if (!editFormData.amount || !editFormData.description || !editFormData.categoryId || !editFormData.accountId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setUpdating(true);
    try {
      const updatedTransaction = {
        ...editFormData,
        amount: parseFloat(editFormData.amount),
        categoryId: parseInt(editFormData.categoryId),
        accountId: parseInt(editFormData.accountId),
      };

      await transactionService.update(id, updatedTransaction);
      
      setTransactions(transactions.map(t => 
        t.Id === id ? { ...t, ...updatedTransaction } : t
      ));
      
      setEditingId(null);
      setEditFormData({});
      toast.success("Transaction updated successfully");
    } catch (err) {
      toast.error("Failed to update transaction");
    } finally {
      setUpdating(false);
    }
  };

  const handleEditInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await transactionService.delete(id);
        setTransactions(transactions.filter(t => t.Id !== id));
        toast.success("Transaction deleted successfully");
      } catch (err) {
        toast.error("Failed to delete transaction");
      }
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.amount.toString().includes(searchTerm);
    
    const matchesDateRange = (!dateRange.start || new Date(transaction.date) >= new Date(dateRange.start)) &&
                            (!dateRange.end || new Date(transaction.date) <= new Date(dateRange.end));
    
    return matchesSearch && matchesDateRange;
  });

  const displayTransactions = limit ? filteredTransactions.slice(0, limit) : filteredTransactions;

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <CardTitle>Recent Transactions</CardTitle>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <SearchBar onSearch={setSearchTerm} placeholder="Search transactions..." />
            <DateRangePicker onDateRangeChange={setDateRange} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {displayTransactions.length === 0 ? (
          <Empty
            title="No transactions found"
message="Start by adding your first transaction to track your finances."
          icon="CreditCard"
        />
      ) : (
        <div className="space-y-4">
          {displayTransactions.map((transaction) => {
            const category = categories.find(c => c.Id === transaction.categoryId);
            const account = accounts.find(a => a.Id === transaction.accountId);
              const isEditing = editingId === transaction.Id;
              
              if (isEditing) {
                const expenseCategories = categories.filter(cat => cat.type === "expense");
                const incomeCategories = categories.filter(cat => cat.type === "income");
                const availableCategories = editFormData.type === "expense" ? expenseCategories : incomeCategories;

                return (
                  <div key={transaction.Id} className="p-4 bg-surface rounded-lg border border-primary-200">
                    <div className="space-y-4">
                      <div className="flex rounded-lg border border-secondary-200 p-1">
                        <Button
                          type="button"
                          variant={editFormData.type === "expense" ? "primary" : "ghost"}
                          size="sm"
                          onClick={() => handleEditInputChange("type", "expense")}
                          className="flex-1"
                        >
                          <ApperIcon name="Minus" className="w-4 h-4 mr-1" />
                          Expense
                        </Button>
                        <Button
                          type="button"
                          variant={editFormData.type === "income" ? "primary" : "ghost"}
                          size="sm"
                          onClick={() => handleEditInputChange("type", "income")}
                          className="flex-1"
                        >
                          <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
                          Income
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Amount">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editFormData.amount}
                            onChange={(e) => handleEditInputChange("amount", e.target.value)}
                            className="flex h-10 w-full rounded-lg border border-secondary-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </FormField>

                        <FormField label="Description">
                          <input
                            type="text"
                            value={editFormData.description}
                            onChange={(e) => handleEditInputChange("description", e.target.value)}
                            className="flex h-10 w-full rounded-lg border border-secondary-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </FormField>

                        <FormField label="Category">
                          <Select
                            value={editFormData.categoryId}
                            onValueChange={(value) => handleEditInputChange("categoryId", value)}
                            required
                          >
                            <option value="">Select category</option>
                            {availableCategories.map((category) => (
                              <option key={category.Id} value={category.Id}>
                                {category.name}
                              </option>
                            ))}
                          </Select>
                        </FormField>

                        <FormField label="Account">
                          <Select
                            value={editFormData.accountId}
                            onValueChange={(value) => handleEditInputChange("accountId", value)}
                            required
                          >
                            <option value="">Select account</option>
                            {accounts.map((account) => (
                              <option key={account.Id} value={account.Id}>
                                {account.name}
                              </option>
                            ))}
                          </Select>
                        </FormField>

                        <FormField label="Date">
                          <input
                            type="date"
                            value={editFormData.date}
                            onChange={(e) => handleEditInputChange("date", e.target.value)}
                            className="flex h-10 w-full rounded-lg border border-secondary-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </FormField>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => handleUpdateTransaction(transaction.Id)}
                          disabled={updating}
                        >
                          {updating ? (
                            <>
                              <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <ApperIcon name="Check" className="w-4 h-4 mr-2" />
                              Save
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleCancelEdit}
                          disabled={updating}
                        >
                          <ApperIcon name="X" className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              }
              
              return (
                <div
                  key={transaction.Id}
                  className="flex items-center justify-between p-4 bg-surface rounded-lg hover:bg-secondary-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    {category && <CategoryIcon category={category} />}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-secondary-800">{transaction.description}</h4>
                        <Badge variant={transaction.type === "income" ? "success" : "default"}>
                          {transaction.type}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-secondary-500">
                        <span>{formatDate(transaction.date)}</span>
                        <span>•</span>
                        <span>{account?.name}</span>
                        <span>•</span>
                        <span>{category?.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === "income" ? "text-accent-600" : "text-secondary-800"
                      }`}>
                        {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                      </p>
                    </div>
                    {showActions && (
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditTransaction(transaction)}
                        >
                          <ApperIcon name="Edit" className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteTransaction(transaction.Id)}
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </Button>
                      </div>
)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </CardContent>
  </Card>
);
};

export default TransactionList;