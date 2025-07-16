import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Chart from "react-apexcharts";
import { transactionService } from "@/services/api/transactionService";
import { categoryService } from "@/services/api/categoryService";
import { formatCurrency } from "@/utils/formatters";
import { toast } from "react-toastify";

const ExpenseChart = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [transactionsData, categoriesData] = await Promise.all([
        transactionService.getAll(),
        categoryService.getAll()
      ]);
      
      setTransactions(transactionsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load chart data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getExpenseData = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const expenseTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transaction.type === "expense" &&
             transactionDate.getMonth() === currentMonth &&
             transactionDate.getFullYear() === currentYear;
    });

    const categoryTotals = {};
    
    expenseTransactions.forEach(transaction => {
      const category = categories.find(c => c.Id === transaction.categoryId);
      if (category) {
        categoryTotals[category.name] = (categoryTotals[category.name] || 0) + transaction.amount;
      }
    });

    return Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const expenseData = getExpenseData();

  if (expenseData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Empty
            title="No expenses this month"
            message="Start adding transactions to see your expense breakdown."
            icon="PieChart"
          />
        </CardContent>
      </Card>
    );
  }

  const chartOptions = {
    chart: {
      type: "donut",
      height: 350,
    },
    labels: expenseData.map(([name]) => name),
    colors: ["#2563EB", "#7C3AED", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return Math.round(val) + "%";
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return formatCurrency(val);
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 280,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const chartSeries = expenseData.map(([, amount]) => amount);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        <p className="text-sm text-secondary-500">Current month spending by category</p>
      </CardHeader>
      <CardContent>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="donut"
          height={350}
        />
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;