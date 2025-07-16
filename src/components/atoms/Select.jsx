import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ className, children, onValueChange, onChange, ...props }, ref) => {
  const handleChange = (event) => {
    const value = event.target.value;
    
    // Call the standard onChange if provided
    if (onChange) {
      onChange(event);
    }
    
    // Call onValueChange with just the value if provided
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-lg border border-secondary-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        className
      )}
      ref={ref}
      onChange={handleChange}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;