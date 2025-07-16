import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency } from "@/utils/formatters";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon, trend, trendLabel, color = "primary" }) => {
  const colorClasses = {
    primary: "text-primary-600 bg-primary-50 border-primary-200",
    accent: "text-accent-600 bg-accent-50 border-accent-200",
    warning: "text-yellow-600 bg-yellow-50 border-yellow-200",
    error: "text-error bg-red-50 border-red-200",
  };

  const trendColor = trend > 0 ? "text-accent-600" : trend < 0 ? "text-error" : "text-secondary-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="p-6 hover:shadow-lg transition-all duration-200">
        <CardContent className="p-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-secondary-600">{title}</p>
              <p className="text-2xl font-bold text-secondary-900">
                {typeof value === "number" ? formatCurrency(value) : value}
              </p>
              {trend !== undefined && (
                <div className="flex items-center space-x-1">
                  <ApperIcon 
                    name={trend > 0 ? "TrendingUp" : trend < 0 ? "TrendingDown" : "Minus"} 
                    className={`w-4 h-4 ${trendColor}`}
                  />
                  <span className={`text-xs font-medium ${trendColor}`}>
                    {Math.abs(trend).toFixed(1)}% {trendLabel}
                  </span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
              <ApperIcon name={icon} className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;