import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency } from "@/utils/formatters";
import { transactionService } from "@/services/api/transactionService";
import { categoryService } from "@/services/api/categoryService";
import { accountService } from "@/services/api/accountService";
import { toast } from "react-toastify";
import { useEffect } from "react";

const QuickActions = ({ onTransactionAdded }) => {
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    description: "",
    categoryId: "",
    accountId: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, accountsData] = await Promise.all([
          categoryService.getAll(),
          accountService.getAll()
        ]);
        setCategories(categoriesData);
        setAccounts(accountsData);
        
        if (categoriesData.length > 0) {
          setFormData(prev => ({
            ...prev,
            categoryId: categoriesData[0].Id.toString()
          }));
        }
        if (accountsData.length > 0) {
          setFormData(prev => ({
            ...prev,
            accountId: accountsData[0].Id.toString()
          }));
        }
      } catch (err) {
        toast.error("Failed to load form data");
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description || !formData.categoryId || !formData.accountId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    
    try {
      const newTransaction = {
        ...formData,
        amount: parseFloat(formData.amount),
        categoryId: parseInt(formData.categoryId),
        accountId: parseInt(formData.accountId),
      };

      await transactionService.create(newTransaction);
      
      setFormData({
        type: "expense",
        amount: "",
        description: "",
        categoryId: categories[0]?.Id?.toString() || "",
        accountId: accounts[0]?.Id?.toString() || "",
        date: new Date().toISOString().split("T")[0],
      });
      
      toast.success("Transaction added successfully!");
      onTransactionAdded?.();
    } catch (err) {
      toast.error("Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const expenseCategories = categories.filter(cat => cat.type === "expense");
  const incomeCategories = categories.filter(cat => cat.type === "income");
  const availableCategories = formData.type === "expense" ? expenseCategories : incomeCategories;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ApperIcon name="Zap" className="w-5 h-5" />
          <span>Quick Add Transaction</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField>
              <div className="flex rounded-lg border border-secondary-200 p-1">
                <Button
                  type="button"
                  variant={formData.type === "expense" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => handleInputChange("type", "expense")}
                  className="flex-1"
                >
                  <ApperIcon name="Minus" className="w-4 h-4 mr-1" />
                  Expense
                </Button>
                <Button
                  type="button"
                  variant={formData.type === "income" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => handleInputChange("type", "income")}
                  className="flex-1"
                >
                  <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
                  Income
                </Button>
              </div>
            </FormField>

            <FormField label="Amount">
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className="flex h-10 w-full rounded-lg border border-secondary-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0.00"
                required
              />
            </FormField>
          </div>

          <FormField label="Description">
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="flex h-10 w-full rounded-lg border border-secondary-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter description..."
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Category">
              <select
                value={formData.categoryId}
                onChange={(e) => handleInputChange("categoryId", e.target.value)}
                className="flex h-10 w-full rounded-lg border border-secondary-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="">Select category</option>
                {availableCategories.map((category) => (
                  <option key={category.Id} value={category.Id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Account">
              <select
                value={formData.accountId}
                onChange={(e) => handleInputChange("accountId", e.target.value)}
                className="flex h-10 w-full rounded-lg border border-secondary-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="">Select account</option>
                {accounts.map((account) => (
                  <option key={account.Id} value={account.Id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="Date">
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="flex h-10 w-full rounded-lg border border-secondary-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </FormField>

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Add Transaction
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuickActions;