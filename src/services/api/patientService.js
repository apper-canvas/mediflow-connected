import patientData from '../mockData/patients.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PatientService {
  constructor() {
    this.patients = [...patientData];
  }

  async getAll() {
    await delay(300);
    return [...this.patients];
  }

  async getById(id) {
    await delay(200);
    const patient = this.patients.find(p => p.userId === id);
    return patient ? { ...patient } : null;
  }

  async search(query) {
    await delay(250);
    const searchTerm = query.toLowerCase();
    return this.patients
      .filter(p => 
        p.name?.toLowerCase().includes(searchTerm) ||
        p.email?.toLowerCase().includes(searchTerm) ||
        p.phone?.includes(searchTerm)
      )
      .map(p => ({ ...p }));
  }

  async create(patientData) {
    await delay(400);
    const newPatient = {
      ...patientData,
      createdAt: new Date().toISOString()
    };
    this.patients.push(newPatient);
    return { ...newPatient };
  }

  async update(userId, patientData) {
    await delay(350);
    const index = this.patients.findIndex(p => p.userId === userId);
    if (index === -1) throw new Error('Patient not found');
    
    this.patients[index] = { ...this.patients[index], ...patientData };
    return { ...this.patients[index] };
  }

  async delete(userId) {
    await delay(300);
    const index = this.patients.findIndex(p => p.userId === userId);
    if (index === -1) throw new Error('Patient not found');
    
    this.patients.splice(index, 1);
    return true;
  }
}

export default new PatientService();