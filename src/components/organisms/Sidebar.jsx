import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: "Home",
    },
    {
      name: "Transactions",
      href: "/transactions",
      icon: "CreditCard",
    },
{
      name: "Budgets",
      href: "/budgets",
      icon: "Target",
    },
    {
      name: "Goals",
      href: "/goals",
      icon: "Flag",
    },
    {
      name: "Accounts",
      href: "/accounts",
      icon: "Wallet",
    },
  ];

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <NavLink
        to={item.href}
        onClick={onClose}
        className={cn(
          "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-gradient-to-r from-primary-50 to-blue-50 text-primary-600 border-r-2 border-primary-600"
            : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-700"
        )}
      >
        <ApperIcon name={item.icon} className="w-5 h-5" />
        <span>{item.name}</span>
      </NavLink>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-secondary-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <ApperIcon name="DollarSign" className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-secondary-800">CashFlow</h1>
                    <p className="text-sm text-secondary-500">Compass</p>
                  </div>
                </div>
              </div>
              <nav className="mt-8 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={cn("lg:hidden", isOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 flex z-40">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative flex-1 flex flex-col max-w-xs w-full bg-white"
          >
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={onClose}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <ApperIcon name="X" className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <ApperIcon name="DollarSign" className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-secondary-800">CashFlow</h1>
                    <p className="text-sm text-secondary-500">Compass</p>
                  </div>
                </div>
              </div>
              <nav className="mt-8 px-2 space-y-1">
                {navigation.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </nav>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;