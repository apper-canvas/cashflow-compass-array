import categoriesData from "@/services/mockData/categories.json";

class CategoryService {
  constructor() {
    this.categories = [...categoriesData];
  }

  async getAll() {
    await this.delay();
    return [...this.categories];
  }

  async getById(id) {
    await this.delay();
    const category = this.categories.find(c => c.Id === id);
    if (!category) {
      throw new Error("Category not found");
    }
    return { ...category };
  }

  async create(categoryData) {
    await this.delay();
    const newCategory = {
      ...categoryData,
      Id: Math.max(...this.categories.map(c => c.Id)) + 1,
    };
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, categoryData) {
    await this.delay();
    const index = this.categories.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Category not found");
    }
    this.categories[index] = { ...this.categories[index], ...categoryData };
    return { ...this.categories[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.categories.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Category not found");
    }
    this.categories.splice(index, 1);
    return true;
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const categoryService = new CategoryService();