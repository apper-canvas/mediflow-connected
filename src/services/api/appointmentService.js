import appointmentData from '../mockData/appointments.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AppointmentService {
  constructor() {
    this.appointments = [...appointmentData];
  }

  async getAll() {
    await delay(300);
    return [...this.appointments];
  }

  async getById(id) {
    await delay(200);
    const appointment = this.appointments.find(a => a.id === id);
    return appointment ? { ...appointment } : null;
  }

  async getByPatientId(patientId) {
    await delay(250);
    return this.appointments
      .filter(a => a.patientId === patientId)
      .map(a => ({ ...a }));
  }

  async getByDoctorId(doctorId) {
    await delay(250);
    return this.appointments
      .filter(a => a.doctorId === doctorId)
      .map(a => ({ ...a }));
  }

  async getByDate(date) {
    await delay(250);
    const targetDate = new Date(date).toDateString();
    return this.appointments
      .filter(a => new Date(a.dateTime).toDateString() === targetDate)
      .map(a => ({ ...a }));
  }

  async getTodaysAppointments() {
    await delay(200);
    const today = new Date().toDateString();
    return this.appointments
      .filter(a => new Date(a.dateTime).toDateString() === today)
      .map(a => ({ ...a }));
  }

  async create(appointmentData) {
    await delay(400);
    const newAppointment = {
      id: Date.now().toString(),
      ...appointmentData,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };
    this.appointments.push(newAppointment);
    return { ...newAppointment };
  }

  async update(id, appointmentData) {
    await delay(350);
    const index = this.appointments.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Appointment not found');
    
    this.appointments[index] = { ...this.appointments[index], ...appointmentData };
    return { ...this.appointments[index] };
  }

  async updateStatus(id, status) {
    await delay(300);
    const index = this.appointments.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Appointment not found');
    
    this.appointments[index].status = status;
    return { ...this.appointments[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.appointments.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Appointment not found');
    
    this.appointments.splice(index, 1);
    return true;
  }
}

export default new AppointmentService();