import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import CategoryIcon from "@/components/molecules/CategoryIcon";
import SearchBar from "@/components/molecules/SearchBar";
import DateRangePicker from "@/components/molecules/DateRangePicker";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { transactionService } from "@/services/api/transactionService";
import { categoryService } from "@/services/api/categoryService";
import { accountService } from "@/services/api/accountService";
import { toast } from "react-toastify";

const TransactionList = ({ showActions = true, limit }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

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
                        <Button variant="ghost" size="sm">
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