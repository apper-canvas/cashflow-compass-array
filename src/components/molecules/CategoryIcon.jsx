import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CategoryIcon = ({ category, size = "md", className }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center",
        sizes[size],
        className
      )}
      style={{ backgroundColor: category.color }}
    >
      <ApperIcon 
        name={category.icon} 
        className={cn("text-white", iconSizes[size])} 
      />
    </div>
  );
};

export default CategoryIcon;