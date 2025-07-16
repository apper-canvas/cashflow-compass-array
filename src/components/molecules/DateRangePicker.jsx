import { useState } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const DateRangePicker = ({ onDateRangeChange, defaultRange }) => {
  const [startDate, setStartDate] = useState(defaultRange?.start || "");
  const [endDate, setEndDate] = useState(defaultRange?.end || "");

  const handleApply = () => {
    onDateRangeChange({
      start: startDate,
      end: endDate,
    });
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    onDateRangeChange({ start: "", end: "" });
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-2 bg-white border border-secondary-200 rounded-lg px-3 py-2">
        <ApperIcon name="Calendar" className="w-4 h-4 text-secondary-400" />
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border-0 p-0 h-auto focus:ring-0"
        />
        <span className="text-secondary-400">to</span>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border-0 p-0 h-auto focus:ring-0"
        />
      </div>
      <Button onClick={handleApply} variant="primary" size="sm">
        Apply
      </Button>
      <Button onClick={handleReset} variant="ghost" size="sm">
        Reset
      </Button>
    </div>
  );
};

export default DateRangePicker;