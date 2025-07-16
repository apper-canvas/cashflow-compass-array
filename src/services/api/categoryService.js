class CategoryService {
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
          { field: { Name: "icon_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "type_c" } }
        ]
      };

      const response = await this.apperClient.fetchRecords('category_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(category => ({
        Id: category.Id,
        name: category.Name,
        Tags: category.Tags,
        icon: category.icon_c,
        color: category.color_c,
        type: category.type_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching categories:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching categories:", error.message);
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
          { field: { Name: "icon_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "type_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById('category_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const category = response.data;
      return {
        Id: category.Id,
        name: category.Name,
        Tags: category.Tags,
        icon: category.icon_c,
        color: category.color_c,
        type: category.type_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching category with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error(`Error fetching category with ID ${id}:`, error.message);
        throw new Error(error.message);
      }
    }
  }

  async create(categoryData) {
    try {
      const params = {
        records: [{
          Name: categoryData.name,
          Tags: categoryData.Tags || "",
          icon_c: categoryData.icon,
          color_c: categoryData.color,
          type_c: categoryData.type
        }]
      };

      const response = await this.apperClient.createRecord('category_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create category");
        }
        
        if (successfulRecords.length > 0) {
          const category = successfulRecords[0].data;
          return {
            Id: category.Id,
            name: category.Name,
            Tags: category.Tags,
            icon: category.icon_c,
            color: category.color_c,
            type: category.type_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating category:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error creating category:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async update(id, categoryData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name: categoryData.name,
          Tags: categoryData.Tags || "",
          icon_c: categoryData.icon,
          color_c: categoryData.color,
          type_c: categoryData.type
        }]
      };

      const response = await this.apperClient.updateRecord('category_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to update category");
        }
        
        if (successfulRecords.length > 0) {
          const category = successfulRecords[0].data;
          return {
            Id: category.Id,
            name: category.Name,
            Tags: category.Tags,
            icon: category.icon_c,
            color: category.color_c,
            type: category.type_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating category:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error updating category:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord('category_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || "Failed to delete category");
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting category:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error deleting category:", error.message);
        throw new Error(error.message);
      }
    }
  }
}

export const categoryService = new CategoryService();