import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import medicalReportService from '@/services/api/medicalReportService';

const FileUpload = ({ patientId, onSuccess, onClose }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [metadata, setMetadata] = useState({
    reportType: '',
    description: '',
    uploadedBy: 'Current Doctor'
  });

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    rejectedFiles.forEach(({ file, errors }) => {
      errors.forEach(error => {
        if (error.code === 'file-too-large') {
          toast.error(`${file.name} is too large (max 10MB)`);
        } else if (error.code === 'file-invalid-type') {
          toast.error(`${file.name} has invalid file type`);
        }
      });
    });

    // Validate and add accepted files
    const validFiles = [];
    acceptedFiles.forEach(file => {
      try {
        medicalReportService.validateFile(file);
        validFiles.push(Object.assign(file, {
          id: Date.now() + Math.random(),
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        }));
      } catch (error) {
        toast.error(`${file.name}: ${error.message}`);
      }
    });

    setFiles(prev => [...prev, ...validFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const removeFile = (fileId) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      // Revoke object URL for images
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updated;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return 'FileText';
    if (fileType.includes('image')) return 'Image';
    if (fileType.includes('word') || fileType.includes('document')) return 'FileText';
    return 'File';
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    if (!metadata.reportType.trim()) {
      toast.error('Please select a report type');
      return;
    }

    setUploading(true);
    const uploadPromises = files.map(async (file, index) => {
      try {
        setUploadProgress(prev => ({ ...prev, [file.id]: 0 }));
        
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => ({
            ...prev,
            [file.id]: Math.min((prev[file.id] || 0) + 20, 90)
          }));
        }, 200);

        const result = await medicalReportService.upload(patientId, file, metadata);
        
        clearInterval(progressInterval);
        setUploadProgress(prev => ({ ...prev, [file.id]: 100 }));
        
        return result;
      } catch (error) {
        toast.error(`Failed to upload ${file.name}: ${error.message}`);
        throw error;
      }
    });

    try {
      await Promise.all(uploadPromises);
      toast.success(`Successfully uploaded ${files.length} file(s)`);
      onSuccess?.();
      onClose?.();
    } catch (error) {
      toast.error('Some files failed to upload');
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-surface-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-surface-900">
              Upload Medical Reports
            </h2>
            <button
              onClick={onClose}
              className="text-surface-500 hover:text-surface-700"
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Metadata Form */}
          <div className="space-y-4 mb-6">
            <FormField
              label="Report Type"
              name="reportType"
              value={metadata.reportType}
              onChange={(e) => setMetadata(prev => ({ ...prev, reportType: e.target.value }))}
              placeholder="e.g., Lab Test, X-Ray, Blood Work"
              required
            />
            <FormField
              label="Description (Optional)"
              name="description"
              value={metadata.description}
              onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the report"
            />
          </div>

          {/* Drop Zone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-surface-300 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <ApperIcon 
              name="Upload" 
              size={48} 
              className={`mx-auto mb-4 ${
                isDragActive ? 'text-primary' : 'text-surface-400'
              }`} 
            />
            <p className="text-lg font-medium text-surface-900 mb-2">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-surface-600 mb-4">
              or click to browse files
            </p>
            <p className="text-sm text-surface-500">
              Supports PDF, DOC, DOCX, JPG, PNG (max 10MB each)
            </p>
          </div>

          {/* File List */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6"
              >
                <h3 className="font-medium text-surface-900 mb-3">
                  Selected Files ({files.length})
                </h3>
                <div className="space-y-2">
                  {files.map((file) => (
                    <motion.div
                      key={file.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center p-3 bg-surface-50 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                        <ApperIcon 
                          name={getFileIcon(file.type)} 
                          size={20} 
                          className="text-primary" 
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-surface-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-sm text-surface-600">
                          {formatFileSize(file.size)}
                        </p>
                        
                        {uploadProgress[file.id] !== undefined && (
                          <div className="mt-2">
                            <div className="w-full bg-surface-200 rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress[file.id]}%` }}
                              />
                            </div>
                            <p className="text-xs text-surface-500 mt-1">
                              {uploadProgress[file.id]}% uploaded
                            </p>
                          </div>
                        )}
                      </div>

                      {!uploading && (
                        <button
                          onClick={() => removeFile(file.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 border-t border-surface-200 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
          >
            {uploading ? (
              <>
                <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <ApperIcon name="Upload" size={16} className="mr-2" />
                Upload Files
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default FileUpload;