import prescriptionData from '../mockData/prescriptions.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PrescriptionService {
  constructor() {
    this.prescriptions = [...prescriptionData];
  }

  async getAll() {
    await delay(300);
    return [...this.prescriptions];
  }

  async getById(id) {
    await delay(200);
    const prescription = this.prescriptions.find(p => p.id === id);
    return prescription ? { ...prescription } : null;
  }

  async getByAppointmentId(appointmentId) {
    await delay(250);
    return this.prescriptions
      .filter(p => p.appointmentId === appointmentId)
      .map(p => ({ ...p }));
  }

  async getByPatientId(patientId) {
    await delay(250);
    return this.prescriptions
      .filter(p => p.patientId === patientId)
      .map(p => ({ ...p }));
  }

  async create(prescriptionData) {
    await delay(400);
    const newPrescription = {
      id: Date.now().toString(),
      ...prescriptionData,
      createdAt: new Date().toISOString()
    };
    this.prescriptions.push(newPrescription);
    return { ...newPrescription };
  }

  async update(id, prescriptionData) {
    await delay(350);
    const index = this.prescriptions.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Prescription not found');
    
    this.prescriptions[index] = { ...this.prescriptions[index], ...prescriptionData };
    return { ...this.prescriptions[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.prescriptions.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Prescription not found');
    
    this.prescriptions.splice(index, 1);
    return true;
  }
}

export default new PrescriptionService();