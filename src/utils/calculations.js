export const calculateBudgetProgress = (spent, allocated) => {
  if (allocated === 0) return 0;
  return Math.min((spent / allocated) * 100, 100);
};

export const calculateBudgetRemaining = (allocated, spent) => {
  return Math.max(allocated - spent, 0);
};

export const calculateTotalByCategory = (transactions, categoryId) => {
  return transactions
    .filter(transaction => transaction.categoryId === categoryId)
    .reduce((sum, transaction) => sum + transaction.amount, 0);
};

export const calculateMonthlySpending = (transactions, month, year) => {
  return transactions
    .filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === month && transactionDate.getFullYear() === year;
    })
    .reduce((sum, transaction) => sum + transaction.amount, 0);
};

export const calculateAccountBalance = (transactions, accountId) => {
  return transactions
    .filter(transaction => transaction.accountId === accountId)
    .reduce((balance, transaction) => {
      return transaction.type === "income" ? balance + transaction.amount : balance - transaction.amount;
    }, 0);
};

export const getTopCategories = (transactions, categories, limit = 5) => {
  const categoryTotals = {};
  
  transactions.forEach(transaction => {
    if (transaction.type === "expense") {
      categoryTotals[transaction.categoryId] = (categoryTotals[transaction.categoryId] || 0) + transaction.amount;
    }
  });
  
  return Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([categoryId, amount]) => ({
      category: categories.find(cat => cat.Id === parseInt(categoryId)),
      amount
    }));
};

export const calculateTrend = (currentValue, previousValue) => {
  if (previousValue === 0) return 0;
  return ((currentValue - previousValue) / previousValue) * 100;
};