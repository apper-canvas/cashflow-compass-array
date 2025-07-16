import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ className, variant = "primary", size = "md", children, ...props }, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-primary-500/25",
    secondary: "bg-white text-secondary-600 border border-secondary-200 hover:bg-secondary-50 hover:border-secondary-300 shadow-sm",
    ghost: "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-700",
    success: "bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 shadow-lg hover:shadow-accent-500/25",
    warning: "bg-gradient-to-r from-warning to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600 shadow-lg hover:shadow-warning/25",
    error: "bg-gradient-to-r from-error to-red-500 text-white hover:from-red-500 hover:to-red-600 shadow-lg hover:shadow-error/25",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;