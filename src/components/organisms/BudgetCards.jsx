import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ProgressRing from "@/components/molecules/ProgressRing";
import CategoryIcon from "@/components/molecules/CategoryIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency } from "@/utils/formatters";
import { calculateBudgetProgress, calculateBudgetRemaining } from "@/utils/calculations";
import { budgetService } from "@/services/api/budgetService";
import { categoryService } from "@/services/api/categoryService";
import { transactionService } from "@/services/api/transactionService";
import { toast } from "react-toastify";

const BudgetCards = ({ limit }) => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [budgetsData, categoriesData, transactionsData] = await Promise.all([
        budgetService.getAll(),
        categoryService.getAll(),
        transactionService.getAll()
      ]);
      
      setBudgets(budgetsData);
      setCategories(categoriesData);
      setTransactions(transactionsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const calculateSpentAmount = (categoryId) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transaction.categoryId === categoryId &&
               transaction.type === "expense" &&
               transactionDate.getMonth() === currentMonth &&
               transactionDate.getFullYear() === currentYear;
      })
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  const displayBudgets = limit ? budgets.slice(0, limit) : budgets;

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-secondary-800">Budget Overview</h2>
        <Button variant="primary">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Budget
        </Button>
      </div>

      {displayBudgets.length === 0 ? (
        <Empty
          title="No budgets set"
          message="Create your first budget to start tracking your spending limits."
          icon="Target"
          actionLabel="Create Budget"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayBudgets.map((budget) => {
            const category = categories.find(c => c.Id === budget.categoryId);
            const spent = calculateSpentAmount(budget.categoryId);
            const progress = calculateBudgetProgress(spent, budget.amount);
            const remaining = calculateBudgetRemaining(budget.amount, spent);
            const isOverBudget = spent > budget.amount;

            return (
              <Card key={budget.Id} className="p-6 hover:shadow-lg transition-all duration-200">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {category && <CategoryIcon category={category} />}
                      <div>
                        <h3 className="font-semibold text-secondary-800">{category?.name}</h3>
                        <p className="text-sm text-secondary-500">Monthly Budget</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="MoreHorizontal" className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-secondary-600">Spent</span>
                        <span className="font-medium">{formatCurrency(spent)}</span>
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isOverBudget 
                              ? "bg-gradient-to-r from-error to-red-500" 
                              : "bg-gradient-to-r from-accent-500 to-accent-600"
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-secondary-500">of {formatCurrency(budget.amount)}</span>
                        <span className={`font-medium ${isOverBudget ? "text-error" : "text-accent-600"}`}>
                          {isOverBudget ? "Over budget" : formatCurrency(remaining)} left
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <ProgressRing
                      progress={progress}
                      size={80}
                      strokeWidth={6}
                      color={isOverBudget ? "#EF4444" : "#10B981"}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BudgetCards;