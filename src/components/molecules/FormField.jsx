import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  children, 
  className,
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      {children || (
        type === "select" ? (
          <Select {...props} />
        ) : (
          <Input type={type} {...props} />
        )
      )}
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default FormField;