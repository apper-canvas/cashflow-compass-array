import { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import TransactionList from "@/components/organisms/TransactionList";
import ExpenseChart from "@/components/organisms/ExpenseChart";
import QuickActions from "@/components/organisms/QuickActions";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { formatCurrency } from "@/utils/formatters";
import { calculateMonthlySpending, calculateTrend } from "@/utils/calculations";
import { transactionService } from "@/services/api/transactionService";
import { accountService } from "@/services/api/accountService";
import { budgetService } from "@/services/api/budgetService";
import { goalService } from "@/services/api/goalService";
import { toast } from "react-toastify";
const Dashboard = () => {
const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
const [transactionsData, accountsData, budgetsData, goalsData] = await Promise.all([
        transactionService.getAll(),
        accountService.getAll(),
        budgetService.getAll(),
        goalService.getAll()
      ]);
      
setTransactions(transactionsData);
      setAccounts(accountsData);
      setBudgets(budgetsData);
      setGoals(goalsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const handleTransactionAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  // Calculate metrics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthIncome = transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === "income" && 
             date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const currentMonthExpenses = transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === "expense" && 
             date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const previousMonthExpenses = transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === "expense" && 
             date.getMonth() === previousMonth && 
             date.getFullYear() === previousYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = accounts.reduce((sum, account) => {
    const accountTransactions = transactions.filter(t => t.accountId === account.Id);
    const balance = accountTransactions.reduce((bal, t) => {
      return t.type === "income" ? bal + t.amount : bal - t.amount;
    }, account.balance);
    return sum + balance;
  }, 0);
const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const activeGoals = goals.filter(goal => goal.status === 'active').length;
  const expenseTrend = calculateTrend(currentMonthExpenses, previousMonthExpenses);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-800">Dashboard</h1>
          <p className="text-secondary-600">Welcome back! Here's your financial overview.</p>
        </div>
      </div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Balance"
          value={totalBalance}
          icon="DollarSign"
          color="primary"
        />
        <StatCard
          title="Monthly Income"
          value={currentMonthIncome}
          icon="TrendingUp"
          color="accent"
        />
        <StatCard
          title="Monthly Expenses"
          value={currentMonthExpenses}
          icon="CreditCard"
          color="warning"
          trend={expenseTrend}
          trendLabel="vs last month"
        />
        <StatCard
          title="Active Goals"
          value={activeGoals}
          icon="Flag"
          color="info"
          format="number"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TransactionList limit={8} />
        </div>
        <div className="space-y-6">
          <QuickActions onTransactionAdded={handleTransactionAdded} />
          <ExpenseChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;