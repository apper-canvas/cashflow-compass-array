import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Select } from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency } from "@/utils/formatters";
import { goalService } from "@/services/api/goalService";
import { toast } from "react-toastify";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    targetAmount: "",
    currentAmount: "",
    targetDate: "",
    category: "",
    status: "active"
  });

  const goalCategories = [
    "Emergency Fund",
    "Vacation",
    "Home Down Payment",
    "Car Purchase",
    "Education",
    "Retirement",
    "Investment",
    "Debt Payoff",
    "Other"
  ];

  const loadGoals = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await goalService.getAll();
      setGoals(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const goalData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0
      };

      if (editingGoal) {
        await goalService.update(editingGoal.Id, goalData);
        toast.success("Goal updated successfully");
      } else {
        await goalService.create(goalData);
        toast.success("Goal created successfully");
      }
      
      resetForm();
      loadGoals();
    } catch (err) {
      toast.error(editingGoal ? "Failed to update goal" : "Failed to create goal");
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      description: goal.description,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      targetDate: goal.targetDate,
      category: goal.category,
      status: goal.status
    });
    setShowForm(true);
  };

  const handleDelete = async (goalId) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      try {
        await goalService.delete(goalId);
        toast.success("Goal deleted successfully");
        loadGoals();
      } catch (err) {
        toast.error("Failed to delete goal");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      targetAmount: "",
      currentAmount: "",
      targetDate: "",
      category: "",
      status: "active"
    });
    setEditingGoal(null);
    setShowForm(false);
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-accent-500";
      case "paused": return "bg-yellow-500";
      default: return "bg-primary-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return "CheckCircle";
      case "paused": return "Pause";
      default: return "Target";
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadGoals} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-800">Goals</h1>
          <p className="text-secondary-600">Track your financial objectives and progress.</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Add Goal</span>
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{editingGoal ? "Edit Goal" : "Create New Goal"}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetForm}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Goal Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Emergency Fund"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    required
                  >
                    <option value="">Select category</option>
                    {goalCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of your goal"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="targetAmount">Target Amount</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                    placeholder="10000"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="currentAmount">Current Amount</Label>
                  <Input
                    id="currentAmount"
                    type="number"
                    value={formData.currentAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentAmount: e.target.value }))}
                    placeholder="0"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="targetDate">Target Date</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingGoal ? "Update Goal" : "Create Goal"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {goals.length === 0 ? (
        <Empty 
          title="No goals yet" 
          description="Create your first financial goal to start tracking your progress."
          action={
            <Button onClick={() => setShowForm(true)}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add First Goal
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const isOverdue = new Date(goal.targetDate) < new Date() && goal.status !== "completed";
            
            return (
              <Card key={goal.Id} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(goal.status)}`}>
                        <ApperIcon name={getStatusIcon(goal.status)} size={16} className="text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{goal.name}</CardTitle>
                        <p className="text-sm text-secondary-500">{goal.category}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(goal)}
                        className="text-secondary-400 hover:text-primary-600"
                      >
                        <ApperIcon name="Edit2" size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(goal.Id)}
                        className="text-secondary-400 hover:text-red-600"
                      >
                        <ApperIcon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {goal.description && (
                    <p className="text-sm text-secondary-600">{goal.description}</p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600">Progress</span>
                      <span className="font-medium">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-secondary-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(goal.status)}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600">
                        {formatCurrency(goal.currentAmount)}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-secondary-100">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Calendar" size={14} className="text-secondary-400" />
                        <span className={isOverdue ? "text-red-600" : "text-secondary-600"}>
                          {new Date(goal.targetDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor(goal.status)}`} />
                        <span className="text-secondary-600 capitalize">{goal.status}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Goals;