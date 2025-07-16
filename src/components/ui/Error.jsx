import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-error to-red-500 rounded-full flex items-center justify-center">
            <ApperIcon name="AlertCircle" className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-secondary-700">Oops! Something went wrong</h3>
            <p className="text-sm text-secondary-500">{message}</p>
          </div>
          {onRetry && (
            <Button onClick={onRetry} variant="primary" className="w-full">
              <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Error;