const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MedicalReportService {
  constructor() {
    // Mock storage for medical reports
    this.reports = [
      {
        id: 'report_1',
        patientId: 'P001',
        fileName: 'blood_test_results.pdf',
        fileType: 'application/pdf',
        fileSize: 245760,
        uploadedBy: 'Dr. Smith',
        uploadedAt: new Date('2024-01-15T10:30:00').toISOString(),
        reportType: 'Lab Test',
        description: 'Complete Blood Count Report'
      },
      {
        id: 'report_2',
        patientId: 'P001',
        fileName: 'xray_chest.jpg',
        fileType: 'image/jpeg',
        fileSize: 1024000,
        uploadedBy: 'Dr. Johnson',
        uploadedAt: new Date('2024-01-20T14:45:00').toISOString(),
        reportType: 'Imaging',
        description: 'Chest X-Ray'
      },
      {
        id: 'report_3',
        patientId: 'P002',
        fileName: 'ecg_results.pdf',
        fileType: 'application/pdf',
        fileSize: 189440,
        uploadedBy: 'Dr. Williams',
        uploadedAt: new Date('2024-01-18T09:15:00').toISOString(),
        reportType: 'Cardiac Test',
        description: 'Electrocardiogram Results'
      }
    ];
  }

  async getByPatient(patientId) {
    await delay(250);
    return this.reports
      .filter(report => report.patientId === patientId)
      .map(report => ({ ...report }));
  }

  async upload(patientId, file, metadata = {}) {
    await delay(1000); // Simulate upload time
    
    const newReport = {
      id: `report_${Date.now()}`,
      patientId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      uploadedBy: metadata.uploadedBy || 'Unknown Doctor',
      uploadedAt: new Date().toISOString(),
      reportType: metadata.reportType || 'General',
      description: metadata.description || '',
      // In a real app, this would be a file URL/path
      fileData: await this.fileToBase64(file)
    };

    this.reports.push(newReport);
    return { ...newReport };
  }

  async delete(reportId) {
    await delay(300);
    const index = this.reports.findIndex(r => r.id === reportId);
    if (index === -1) throw new Error('Report not found');
    
    this.reports.splice(index, 1);
    return true;
  }

  async download(reportId) {
    await delay(400);
    const report = this.reports.find(r => r.id === reportId);
    if (!report) throw new Error('Report not found');
    
    // In a real app, this would return a download URL or blob
    return {
      ...report,
      downloadUrl: report.fileData || '#'
    };
  }

  // Helper method to convert file to base64 (for demo purposes)
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // Get report count for a patient
  async getReportCount(patientId) {
    await delay(150);
    return this.reports.filter(report => report.patientId === patientId).length;
  }

  // Validate file before upload
  validateFile(file) {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not supported. Please upload PDF, DOC, DOCX, or image files.');
    }
    
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB.');
    }
    
    return true;
  }
}

export default new MedicalReportService();