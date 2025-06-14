import billData from '../mockData/bills.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class BillService {
  constructor() {
    this.bills = [...billData];
  }

  async getAll() {
    await delay(300);
    return [...this.bills];
  }

  async getById(id) {
    await delay(200);
    const bill = this.bills.find(b => b.id === id);
    return bill ? { ...bill } : null;
  }

  async getByPatientId(patientId) {
    await delay(250);
    return this.bills
      .filter(b => b.patientId === patientId)
      .map(b => ({ ...b }));
  }

  async getByStatus(status) {
    await delay(250);
    return this.bills
      .filter(b => b.status === status)
      .map(b => ({ ...b }));
  }

  async getPendingBills() {
    await delay(200);
    return this.bills
      .filter(b => b.status === 'pending')
      .map(b => ({ ...b }));
  }

  async create(billData) {
    await delay(400);
    const newBill = {
      id: Date.now().toString(),
      ...billData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.bills.push(newBill);
    return { ...newBill };
  }

  async update(id, billData) {
    await delay(350);
    const index = this.bills.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Bill not found');
    
    this.bills[index] = { ...this.bills[index], ...billData };
    return { ...this.bills[index] };
  }

  async updateStatus(id, status) {
    await delay(300);
    const index = this.bills.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Bill not found');
    
    this.bills[index].status = status;
    return { ...this.bills[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.bills.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Bill not found');
    
    this.bills.splice(index, 1);
    return true;
  }
}

export default new BillService();