import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import StudentModal from '@/components/organisms/StudentModal';
import { studentService } from '@/services/api/studentService';

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentChange = (student) => {
    if (editingStudent) {
      // Update existing student
      setStudents(prev => prev.map(s => s.Id === student.Id ? student : s));
    } else {
      // Add new student
      setStudents(prev => [...prev, student]);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = async (student) => {
    if (!confirm(`Are you sure you want to delete ${student.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await studentService.delete(student.Id);
      setStudents(prev => prev.filter(s => s.Id !== student.Id));
      toast.success('Student deleted successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to delete student');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

const filteredStudents = students.filter(student =>
    (student.Name || student.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.email_c || student.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.studentId_c || student.studentId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.major_c || student.major || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getYearBadgeColor = (year) => {
    const colors = {
      1: 'bg-blue-100 text-blue-800',
      2: 'bg-green-100 text-green-800',
      3: 'bg-yellow-100 text-yellow-800',
      4: 'bg-purple-100 text-purple-800'
    };
    return colors[year] || 'bg-gray-100 text-gray-800';
  };

  const getGpaBadgeColor = (gpa) => {
    if (gpa >= 3.5) return 'bg-emerald-100 text-emerald-800';
    if (gpa >= 3.0) return 'bg-blue-100 text-blue-800';
    if (gpa >= 2.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorView
        message={error}
        onRetry={loadStudents}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Students</h1>
            <p className="text-gray-600">Manage your student roster</p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 sm:mt-0"
          >
            <ApperIcon name="Plus" size={20} className="mr-2" />
            Add Student
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="relative">
            <ApperIcon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name, email, ID, or major..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Students Grid */}
        {filteredStudents.length === 0 ? (
          <Empty
            icon="Users"
            title={searchTerm ? "No students found" : "No students yet"}
            description={searchTerm ? "Try adjusting your search terms" : "Add your first student to get started"}
            action={!searchTerm ? (
              <Button onClick={() => setIsModalOpen(true)}>
                <ApperIcon name="Plus" size={20} className="mr-2" />
                Add Student
              </Button>
            ) : null}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
{(student.Name || student.name || 'S').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{student.Name || student.name}</h3>
                      <p className="text-sm text-gray-500">{student.studentId_c || student.studentId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(student)}
                      className="text-gray-400 hover:text-primary-600"
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(student)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Mail" size={16} className="mr-2" />
{student.email_c || student.email}
                  </div>
                  {(student.major_c || student.major) && (
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="BookOpen" size={16} className="mr-2" />
                      {student.major_c || student.major}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
<Badge className={`text-xs ${getYearBadgeColor(student.year_c || student.year)}`}>
                      Year {student.year_c || student.year}
                    </Badge>
                    <Badge className={`text-xs ${getGpaBadgeColor(student.gpa_c || student.gpa)}`}>
                      GPA: {(student.gpa_c || student.gpa || 0).toFixed(1)}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Student Modal */}
        <StudentModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          student={editingStudent}
          onStudentChange={handleStudentChange}
        />
      </div>
    </div>
  );
}

export default Students;