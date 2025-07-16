class TransactionService {
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
          { field: { Name: "type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { 
            field: { name: "category_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "account_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        orderBy: [
          {
            fieldName: "date_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('transaction_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(transaction => ({
        Id: transaction.Id,
        name: transaction.Name,
        Tags: transaction.Tags,
        amount: transaction.amount_c,
        type: transaction.type_c,
        description: transaction.description_c,
        date: transaction.date_c,
        categoryId: transaction.category_id_c?.Id || transaction.category_id_c,
        accountId: transaction.account_id_c?.Id || transaction.account_id_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching transactions:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching transactions:", error.message);
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
          { field: { Name: "type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { 
            field: { name: "category_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "account_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };

      const response = await this.apperClient.getRecordById('transaction_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const transaction = response.data;
      return {
        Id: transaction.Id,
        name: transaction.Name,
        Tags: transaction.Tags,
        amount: transaction.amount_c,
        type: transaction.type_c,
        description: transaction.description_c,
        date: transaction.date_c,
        categoryId: transaction.category_id_c?.Id || transaction.category_id_c,
        accountId: transaction.account_id_c?.Id || transaction.account_id_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching transaction with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error(`Error fetching transaction with ID ${id}:`, error.message);
        throw new Error(error.message);
      }
    }
  }

  async create(transactionData) {
    try {
      const params = {
        records: [{
          Name: transactionData.description,
          Tags: transactionData.Tags || "",
          amount_c: transactionData.amount,
          type_c: transactionData.type,
          description_c: transactionData.description,
          date_c: transactionData.date,
          category_id_c: transactionData.categoryId,
          account_id_c: transactionData.accountId
        }]
      };

      const response = await this.apperClient.createRecord('transaction_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create transaction");
        }
        
        if (successfulRecords.length > 0) {
          const transaction = successfulRecords[0].data;
          return {
            Id: transaction.Id,
            name: transaction.Name,
            Tags: transaction.Tags,
            amount: transaction.amount_c,
            type: transaction.type_c,
            description: transaction.description_c,
            date: transaction.date_c,
            categoryId: transaction.category_id_c,
            accountId: transaction.account_id_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating transaction:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error creating transaction:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async update(id, transactionData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name: transactionData.description,
          Tags: transactionData.Tags || "",
          amount_c: transactionData.amount,
          type_c: transactionData.type,
          description_c: transactionData.description,
          date_c: transactionData.date,
          category_id_c: transactionData.categoryId,
          account_id_c: transactionData.accountId
        }]
      };

      const response = await this.apperClient.updateRecord('transaction_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to update transaction");
        }
        
        if (successfulRecords.length > 0) {
          const transaction = successfulRecords[0].data;
          return {
            Id: transaction.Id,
            name: transaction.Name,
            Tags: transaction.Tags,
            amount: transaction.amount_c,
            type: transaction.type_c,
            description: transaction.description_c,
            date: transaction.date_c,
            categoryId: transaction.category_id_c,
            accountId: transaction.account_id_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating transaction:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error updating transaction:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord('transaction_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || "Failed to delete transaction");
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting transaction:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error deleting transaction:", error.message);
        throw new Error(error.message);
      }
    }
  }
}

export const transactionService = new TransactionService();