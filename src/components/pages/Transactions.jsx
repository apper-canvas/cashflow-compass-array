import { useState, useEffect } from "react";
import TransactionList from "@/components/organisms/TransactionList";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const Transactions = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-800">Transactions</h1>
          <p className="text-secondary-600">View and manage all your financial transactions.</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={handleRefresh}>
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="primary">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      <TransactionList key={refreshKey} showActions={true} />
    </motion.div>
  );
};

export default Transactions;