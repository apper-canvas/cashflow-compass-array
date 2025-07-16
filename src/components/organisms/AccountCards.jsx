import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { formatCurrency } from "@/utils/formatters";
import { calculateAccountBalance } from "@/utils/calculations";
import { accountService } from "@/services/api/accountService";
import { transactionService } from "@/services/api/transactionService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const AccountCards = ({ limit }) => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [accountsData, transactionsData] = await Promise.all([
        accountService.getAll(),
        transactionService.getAll()
      ]);
      
      setAccounts(accountsData);
      setTransactions(transactionsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getAccountTypeIcon = (type) => {
    switch (type) {
      case "checking":
        return "CreditCard";
      case "savings":
        return "PiggyBank";
      case "credit":
        return "CreditCard";
      case "cash":
        return "Wallet";
      default:
        return "Wallet";
    }
  };

  const displayAccounts = limit ? accounts.slice(0, limit) : accounts;

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-secondary-800">Your Accounts</h2>
        <Button variant="primary">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Account
        </Button>
      </div>

      {displayAccounts.length === 0 ? (
        <Empty
          title="No accounts found"
          message="Add your first account to start tracking your finances."
          icon="Wallet"
          actionLabel="Add Account"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayAccounts.map((account, index) => {
            const balance = calculateAccountBalance(transactions, account.Id);
            
            return (
              <motion.div
                key={account.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: account.color }}
                        >
                          <ApperIcon 
                            name={getAccountTypeIcon(account.type)} 
                            className="w-6 h-6 text-white" 
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-secondary-800">{account.name}</h3>
                          <p className="text-sm text-secondary-500 capitalize">{account.type}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ApperIcon name="MoreHorizontal" className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-secondary-600">Current Balance</span>
                        <span className={`text-2xl font-bold ${
                          balance >= 0 ? "text-accent-600" : "text-error"
                        }`}>
                          {formatCurrency(balance)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-secondary-500">
                          {transactions.filter(t => t.accountId === account.Id).length} transactions
                        </span>
                        <div className="flex items-center space-x-1">
                          <ApperIcon 
                            name={balance >= 0 ? "TrendingUp" : "TrendingDown"} 
                            className={`w-4 h-4 ${balance >= 0 ? "text-accent-600" : "text-error"}`}
                          />
                          <span className={balance >= 0 ? "text-accent-600" : "text-error"}>
                            {balance >= 0 ? "Positive" : "Negative"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-secondary-200">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="flex-1">
                          <ApperIcon name="ArrowUpRight" className="w-4 h-4 mr-1" />
                          Send
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1">
                          <ApperIcon name="ArrowDownLeft" className="w-4 h-4 mr-1" />
                          Receive
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AccountCards;