class BudgetService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "period_c" } },
          { field: { Name: "spent_c" } },
          { 
            field: { name: "category_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('budget_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(budget => ({
        Id: budget.Id,
        name: budget.Name,
        Tags: budget.Tags,
        amount: budget.amount_c,
        period: budget.period_c,
        spent: budget.spent_c,
        categoryId: budget.category_id_c?.Id || budget.category_id_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching budgets:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching budgets:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "period_c" } },
          { field: { Name: "spent_c" } },
          { 
            field: { name: "category_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };

      const response = await this.apperClient.getRecordById('budget_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const budget = response.data;
      return {
        Id: budget.Id,
        name: budget.Name,
        Tags: budget.Tags,
        amount: budget.amount_c,
        period: budget.period_c,
        spent: budget.spent_c,
        categoryId: budget.category_id_c?.Id || budget.category_id_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching budget with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error(`Error fetching budget with ID ${id}:`, error.message);
        throw new Error(error.message);
      }
    }
  }

  async create(budgetData) {
    try {
      const params = {
        records: [{
          Name: budgetData.name,
          Tags: budgetData.Tags || "",
          amount_c: budgetData.amount,
          period_c: budgetData.period,
          spent_c: budgetData.spent || 0,
          category_id_c: budgetData.categoryId
        }]
      };

      const response = await this.apperClient.createRecord('budget_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create budget");
        }
        
        if (successfulRecords.length > 0) {
          const budget = successfulRecords[0].data;
          return {
            Id: budget.Id,
            name: budget.Name,
            Tags: budget.Tags,
            amount: budget.amount_c,
            period: budget.period_c,
            spent: budget.spent_c,
            categoryId: budget.category_id_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating budget:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error creating budget:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async update(id, budgetData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name: budgetData.name,
          Tags: budgetData.Tags || "",
          amount_c: budgetData.amount,
          period_c: budgetData.period,
          spent_c: budgetData.spent,
          category_id_c: budgetData.categoryId
        }]
      };

      const response = await this.apperClient.updateRecord('budget_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to update budget");
        }
        
        if (successfulRecords.length > 0) {
          const budget = successfulRecords[0].data;
          return {
            Id: budget.Id,
            name: budget.Name,
            Tags: budget.Tags,
            amount: budget.amount_c,
            period: budget.period_c,
            spent: budget.spent_c,
            categoryId: budget.category_id_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating budget:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error updating budget:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord('budget_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || "Failed to delete budget");
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting budget:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error deleting budget:", error.message);
        throw new Error(error.message);
      }
    }
  }
}

export const budgetService = new BudgetService();