import studentsData from '@/services/mockData/students.json';

let students = [...studentsData];
let nextId = Math.max(...students.map(s => s.Id)) + 1;

export const studentService = {
  // Get all students
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...students];
  },

  // Get student by ID
  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const student = students.find(s => s.Id === parseInt(id));
    if (!student) {
      throw new Error('Student not found');
    }
    return { ...student };
  },

  // Create new student
  async create(studentData) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Validate required fields
    if (!studentData.name?.trim()) {
      throw new Error('Student name is required');
    }
    if (!studentData.email?.trim()) {
      throw new Error('Email is required');
    }
    if (!studentData.studentId?.trim()) {
      throw new Error('Student ID is required');
    }

    // Check for duplicate student ID
    if (students.some(s => s.studentId === studentData.studentId)) {
      throw new Error('Student ID already exists');
    }

    // Check for duplicate email
    if (students.some(s => s.email === studentData.email)) {
      throw new Error('Email already exists');
    }

    const newStudent = {
      Id: nextId++,
      name: studentData.name.trim(),
      email: studentData.email.trim(),
      studentId: studentData.studentId.trim(),
      major: studentData.major?.trim() || '',
      year: studentData.year || 1,
      gpa: studentData.gpa || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    students.push(newStudent);
    return { ...newStudent };
  },

  // Update existing student
  async update(id, studentData) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Student not found');
    }

    // Validate required fields
    if (!studentData.name?.trim()) {
      throw new Error('Student name is required');
    }
    if (!studentData.email?.trim()) {
      throw new Error('Email is required');
    }
    if (!studentData.studentId?.trim()) {
      throw new Error('Student ID is required');
    }

    // Check for duplicate student ID (excluding current student)
    if (students.some(s => s.Id !== parseInt(id) && s.studentId === studentData.studentId)) {
      throw new Error('Student ID already exists');
    }

    // Check for duplicate email (excluding current student)
    if (students.some(s => s.Id !== parseInt(id) && s.email === studentData.email)) {
      throw new Error('Email already exists');
    }

    const updatedStudent = {
      ...students[index],
      name: studentData.name.trim(),
      email: studentData.email.trim(),
      studentId: studentData.studentId.trim(),
      major: studentData.major?.trim() || '',
      year: studentData.year || 1,
      gpa: studentData.gpa || 0,
      updatedAt: new Date().toISOString()
    };

    students[index] = updatedStudent;
    return { ...updatedStudent };
  },

  // Delete student
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Student not found');
    }

    students.splice(index, 1);
    return true;
  }
};