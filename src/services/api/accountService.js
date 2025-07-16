class AccountService {
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
          { field: { Name: "type_c" } },
          { field: { Name: "balance_c" } },
          { field: { Name: "color_c" } }
        ]
      };

      const response = await this.apperClient.fetchRecords('app_account_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(account => ({
        Id: account.Id,
        name: account.Name,
        Tags: account.Tags,
        type: account.type_c,
        balance: account.balance_c,
        color: account.color_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching accounts:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching accounts:", error.message);
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
          { field: { Name: "type_c" } },
          { field: { Name: "balance_c" } },
          { field: { Name: "color_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById('app_account_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const account = response.data;
      return {
        Id: account.Id,
        name: account.Name,
        Tags: account.Tags,
        type: account.type_c,
        balance: account.balance_c,
        color: account.color_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching account with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error(`Error fetching account with ID ${id}:`, error.message);
        throw new Error(error.message);
      }
    }
  }

  async create(accountData) {
    try {
      const params = {
        records: [{
          Name: accountData.name,
          Tags: accountData.Tags || "",
          type_c: accountData.type,
          balance_c: accountData.balance,
          color_c: accountData.color
        }]
      };

      const response = await this.apperClient.createRecord('app_account_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create account");
        }
        
        if (successfulRecords.length > 0) {
          const account = successfulRecords[0].data;
          return {
            Id: account.Id,
            name: account.Name,
            Tags: account.Tags,
            type: account.type_c,
            balance: account.balance_c,
            color: account.color_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating account:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error creating account:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async update(id, accountData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name: accountData.name,
          Tags: accountData.Tags || "",
          type_c: accountData.type,
          balance_c: accountData.balance,
          color_c: accountData.color
        }]
      };

      const response = await this.apperClient.updateRecord('app_account_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to update account");
        }
        
        if (successfulRecords.length > 0) {
          const account = successfulRecords[0].data;
          return {
            Id: account.Id,
            name: account.Name,
            Tags: account.Tags,
            type: account.type_c,
            balance: account.balance_c,
            color: account.color_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating account:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error updating account:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord('app_account_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || "Failed to delete account");
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting account:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error deleting account:", error.message);
        throw new Error(error.message);
      }
    }
  }
}

export const accountService = new AccountService();