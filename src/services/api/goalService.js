class GoalService {
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
          { field: { Name: "description_c" } },
          { field: { Name: "target_amount_c" } },
          { field: { Name: "current_amount_c" } },
          { field: { Name: "target_date_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ]
      };

      const response = await this.apperClient.fetchRecords('goal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(goal => ({
        Id: goal.Id,
        name: goal.Name,
        Tags: goal.Tags,
        description: goal.description_c,
        targetAmount: goal.target_amount_c,
        currentAmount: goal.current_amount_c,
        targetDate: goal.target_date_c,
        category: goal.category_c,
        status: goal.status_c,
        createdAt: goal.created_at_c,
        updatedAt: goal.updated_at_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching goals:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching goals:", error.message);
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
          { field: { Name: "description_c" } },
          { field: { Name: "target_amount_c" } },
          { field: { Name: "current_amount_c" } },
          { field: { Name: "target_date_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById('goal_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const goal = response.data;
      return {
        Id: goal.Id,
        name: goal.Name,
        Tags: goal.Tags,
        description: goal.description_c,
        targetAmount: goal.target_amount_c,
        currentAmount: goal.current_amount_c,
        targetDate: goal.target_date_c,
        category: goal.category_c,
        status: goal.status_c,
        createdAt: goal.created_at_c,
        updatedAt: goal.updated_at_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching goal with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error(`Error fetching goal with ID ${id}:`, error.message);
        throw new Error(error.message);
      }
    }
  }

  async create(goalData) {
    try {
      const params = {
        records: [{
          Name: goalData.name,
          Tags: goalData.Tags || "",
          description_c: goalData.description,
          target_amount_c: goalData.targetAmount,
          current_amount_c: goalData.currentAmount,
          target_date_c: goalData.targetDate,
          category_c: goalData.category,
          status_c: goalData.status,
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.createRecord('goal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create goal");
        }
        
        if (successfulRecords.length > 0) {
          const goal = successfulRecords[0].data;
          return {
            Id: goal.Id,
            name: goal.Name,
            Tags: goal.Tags,
            description: goal.description_c,
            targetAmount: goal.target_amount_c,
            currentAmount: goal.current_amount_c,
            targetDate: goal.target_date_c,
            category: goal.category_c,
            status: goal.status_c,
            createdAt: goal.created_at_c,
            updatedAt: goal.updated_at_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating goal:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error creating goal:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async update(id, goalData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name: goalData.name,
          Tags: goalData.Tags || "",
          description_c: goalData.description,
          target_amount_c: goalData.targetAmount,
          current_amount_c: goalData.currentAmount,
          target_date_c: goalData.targetDate,
          category_c: goalData.category,
          status_c: goalData.status,
          updated_at_c: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.updateRecord('goal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to update goal");
        }
        
        if (successfulRecords.length > 0) {
          const goal = successfulRecords[0].data;
          return {
            Id: goal.Id,
            name: goal.Name,
            Tags: goal.Tags,
            description: goal.description_c,
            targetAmount: goal.target_amount_c,
            currentAmount: goal.current_amount_c,
            targetDate: goal.target_date_c,
            category: goal.category_c,
            status: goal.status_c,
            createdAt: goal.created_at_c,
            updatedAt: goal.updated_at_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating goal:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error updating goal:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord('goal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || "Failed to delete goal");
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting goal:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error deleting goal:", error.message);
        throw new Error(error.message);
      }
    }
  }
}

export const goalService = new GoalService();