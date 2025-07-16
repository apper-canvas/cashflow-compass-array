import { useState, useContext } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { AuthContext } from "@/App";
import { motion } from "framer-motion";

const Header = ({ onToggleSidebar }) => {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="lg:hidden bg-white border-b border-secondary-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-secondary-800">CashFlow Compass</h1>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <ApperIcon name="Bell" className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <ApperIcon name="LogOut" className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;