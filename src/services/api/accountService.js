import accountsData from "@/services/mockData/accounts.json";

class AccountService {
  constructor() {
    this.accounts = [...accountsData];
  }

  async getAll() {
    await this.delay();
    return [...this.accounts];
  }

  async getById(id) {
    await this.delay();
    const account = this.accounts.find(a => a.Id === id);
    if (!account) {
      throw new Error("Account not found");
    }
    return { ...account };
  }

  async create(accountData) {
    await this.delay();
    const newAccount = {
      ...accountData,
      Id: Math.max(...this.accounts.map(a => a.Id)) + 1,
    };
    this.accounts.push(newAccount);
    return { ...newAccount };
  }

  async update(id, accountData) {
    await this.delay();
    const index = this.accounts.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Account not found");
    }
    this.accounts[index] = { ...this.accounts[index], ...accountData };
    return { ...this.accounts[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.accounts.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Account not found");
    }
    this.accounts.splice(index, 1);
    return true;
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const accountService = new AccountService();