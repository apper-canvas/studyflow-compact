import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { cn } from '@/utils/cn';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import { studentService } from '@/services/api/studentService';

function StudentModal({ isOpen, onClose, student, onStudentChange }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    major: '',
    year: 1,
    gpa: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(student);

  // Initialize form data when modal opens or student changes
  useEffect(() => {
    if (isOpen) {
      if (student) {
        setFormData({
          name: student.name || '',
          email: student.email || '',
          studentId: student.studentId || '',
          major: student.major || '',
          year: student.year || 1,
          gpa: student.gpa || 0
        });
      } else {
        setFormData({
          name: '',
          email: '',
          studentId: '',
          major: '',
          year: 1,
          gpa: 0
        });
      }
      setErrors({});
    }
  }, [isOpen, student]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Student name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    }

    if (formData.gpa < 0 || formData.gpa > 4) {
      newErrors.gpa = 'GPA must be between 0 and 4';
    }

    if (formData.year < 1 || formData.year > 4) {
      newErrors.year = 'Year must be between 1 and 4';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let result;
      if (isEditing) {
        result = await studentService.update(student.Id, formData);
        toast.success('Student updated successfully!');
      } else {
        result = await studentService.create(formData);
        toast.success('Student created successfully!');
      }
      
      onStudentChange?.(result);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "w-full max-w-md bg-white rounded-xl shadow-xl",
              "max-h-[90vh] overflow-y-auto"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditing ? 'Edit Student' : 'Add New Student'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  label="Student Name"
                  type="text"
                  placeholder="Enter student name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={errors.name}
                  required
                />

                <FormField
                  label="Email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  required
                />

                <FormField
                  label="Student ID"
                  type="text"
                  placeholder="Enter student ID"
                  value={formData.studentId}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                  error={errors.studentId}
                  required
                />

                <FormField
                  label="Major"
                  type="text"
                  placeholder="Enter major (optional)"
                  value={formData.major}
                  onChange={(e) => handleInputChange('major', e.target.value)}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Select
                      label="Academic Year"
                      value={formData.year}
                      onChange={(value) => handleInputChange('year', parseInt(value))}
                      error={errors.year}
                      options={[
                        { value: 1, label: 'Year 1' },
                        { value: 2, label: 'Year 2' },
                        { value: 3, label: 'Year 3' },
                        { value: 4, label: 'Year 4' }
                      ]}
                    />
                  </div>

                  <FormField
                    label="GPA"
                    type="number"
                    placeholder="0.0"
                    value={formData.gpa}
                    onChange={(e) => handleInputChange('gpa', parseFloat(e.target.value) || 0)}
                    error={errors.gpa}
                    step="0.01"
                    min="0"
                    max="4"
                  />
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
                      </div>
                    ) : (
                      <span>{isEditing ? 'Update Student' : 'Create Student'}</span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default StudentModal;