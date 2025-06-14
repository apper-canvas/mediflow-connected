import doctorData from '../mockData/doctors.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DoctorService {
  constructor() {
    this.doctors = [...doctorData];
  }

  async getAll() {
    await delay(300);
    return [...this.doctors];
  }

  async getById(id) {
    await delay(200);
    const doctor = this.doctors.find(d => d.userId === id);
    return doctor ? { ...doctor } : null;
  }

  async getBySpecialization(specialization) {
    await delay(250);
    return this.doctors
      .filter(d => d.specialization.toLowerCase().includes(specialization.toLowerCase()))
      .map(d => ({ ...d }));
  }

  async create(doctorData) {
    await delay(400);
    const newDoctor = {
      ...doctorData,
      createdAt: new Date().toISOString()
    };
    this.doctors.push(newDoctor);
    return { ...newDoctor };
  }

  async update(userId, doctorData) {
    await delay(350);
    const index = this.doctors.findIndex(d => d.userId === userId);
    if (index === -1) throw new Error('Doctor not found');
    
    this.doctors[index] = { ...this.doctors[index], ...doctorData };
    return { ...this.doctors[index] };
  }

  async delete(userId) {
    await delay(300);
    const index = this.doctors.findIndex(d => d.userId === userId);
    if (index === -1) throw new Error('Doctor not found');
    
    this.doctors.splice(index, 1);
    return true;
  }

  async updateAvailability(userId, availability) {
    await delay(300);
    const index = this.doctors.findIndex(d => d.userId === userId);
    if (index === -1) throw new Error('Doctor not found');
    
    this.doctors[index].availability = availability;
    return { ...this.doctors[index] };
  }
}

export default new DoctorService();