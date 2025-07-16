import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  message = "Get started by adding your first item.", 
  action,
  actionLabel = "Add Item",
  icon = "Inbox"
}) => {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-full flex items-center justify-center">
            <ApperIcon name={icon} className="w-8 h-8 text-secondary-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-secondary-700">{title}</h3>
            <p className="text-sm text-secondary-500">{message}</p>
          </div>
          {action && (
            <Button onClick={action} variant="primary" className="w-full">
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Empty;