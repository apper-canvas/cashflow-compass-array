import mockGoals from '@/services/mockData/goals.json';

let goals = [...mockGoals];
let nextId = Math.max(...goals.map(g => g.Id)) + 1;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const goalService = {
  async getAll() {
    await delay(300);
    return [...goals];
  },

  async getById(id) {
    await delay(300);
    const goal = goals.find(g => g.Id === parseInt(id));
    if (!goal) {
      throw new Error('Goal not found');
    }
    return { ...goal };
  },

  async create(goalData) {
    await delay(300);
    const newGoal = {
      Id: nextId++,
      ...goalData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    goals.push(newGoal);
    return { ...newGoal };
  },

  async update(id, goalData) {
    await delay(300);
    const index = goals.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Goal not found');
    }
    
    goals[index] = {
      ...goals[index],
      ...goalData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    return { ...goals[index] };
  },

  async delete(id) {
    await delay(300);
    const index = goals.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Goal not found');
    }
    
    goals.splice(index, 1);
    return true;
  }
};