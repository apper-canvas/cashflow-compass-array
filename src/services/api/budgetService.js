import budgetsData from "@/services/mockData/budgets.json";

class BudgetService {
  constructor() {
    this.budgets = [...budgetsData];
  }

  async getAll() {
    await this.delay();
    return [...this.budgets];
  }

  async getById(id) {
    await this.delay();
    const budget = this.budgets.find(b => b.Id === id);
    if (!budget) {
      throw new Error("Budget not found");
    }
    return { ...budget };
  }

  async create(budgetData) {
    await this.delay();
    const newBudget = {
      ...budgetData,
      Id: Math.max(...this.budgets.map(b => b.Id)) + 1,
      spent: 0,
    };
    this.budgets.push(newBudget);
    return { ...newBudget };
  }

  async update(id, budgetData) {
    await this.delay();
    const index = this.budgets.findIndex(b => b.Id === id);
    if (index === -1) {
      throw new Error("Budget not found");
    }
    this.budgets[index] = { ...this.budgets[index], ...budgetData };
    return { ...this.budgets[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.budgets.findIndex(b => b.Id === id);
    if (index === -1) {
      throw new Error("Budget not found");
    }
    this.budgets.splice(index, 1);
    return true;
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const budgetService = new BudgetService();