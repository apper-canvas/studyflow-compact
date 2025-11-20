import { getApperClient } from '@/services/apperClient'
import { toast } from 'react-toastify'

export const studentService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('students_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "studentId_c"}},
          {"field": {"Name": "major_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "gpa_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching students:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.getRecordById('students_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "studentId_c"}},
          {"field": {"Name": "major_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "gpa_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async create(studentData) {
    try {
      // Validate required fields
      if (!studentData.name?.trim() && !studentData.Name?.trim()) {
        throw new Error('Student name is required')
      }
      if (!studentData.email?.trim() && !studentData.email_c?.trim()) {
        throw new Error('Email is required')
      }
      if (!studentData.studentId?.trim() && !studentData.studentId_c?.trim()) {
        throw new Error('Student ID is required')
      }

      const apperClient = getApperClient()
      const params = {
        records: [{
          Name: (studentData.name || studentData.Name || '').trim(),
          email_c: (studentData.email || studentData.email_c || '').trim(),
          studentId_c: (studentData.studentId || studentData.studentId_c || '').trim(),
          major_c: (studentData.major || studentData.major_c || '').trim(),
          year_c: (studentData.year || studentData.year_c || 1).toString(),
          gpa_c: parseFloat(studentData.gpa || studentData.gpa_c || 0)
        }]
      }

      const response = await apperClient.createRecord('students_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} students:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error creating student:", error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, studentData) {
    try {
      // Validate required fields
      if (!studentData.name?.trim() && !studentData.Name?.trim()) {
        throw new Error('Student name is required')
      }
      if (!studentData.email?.trim() && !studentData.email_c?.trim()) {
        throw new Error('Email is required')
      }
      if (!studentData.studentId?.trim() && !studentData.studentId_c?.trim()) {
        throw new Error('Student ID is required')
      }

      const apperClient = getApperClient()
      const updateData = {}
      
      if (studentData.name !== undefined || studentData.Name !== undefined) {
        updateData.Name = (studentData.name || studentData.Name || '').trim()
      }
      if (studentData.email !== undefined || studentData.email_c !== undefined) {
        updateData.email_c = (studentData.email || studentData.email_c || '').trim()
      }
      if (studentData.studentId !== undefined || studentData.studentId_c !== undefined) {
        updateData.studentId_c = (studentData.studentId || studentData.studentId_c || '').trim()
      }
      if (studentData.major !== undefined || studentData.major_c !== undefined) {
        updateData.major_c = (studentData.major || studentData.major_c || '').trim()
      }
      if (studentData.year !== undefined || studentData.year_c !== undefined) {
        updateData.year_c = (studentData.year || studentData.year_c || 1).toString()
      }
      if (studentData.gpa !== undefined || studentData.gpa_c !== undefined) {
        updateData.gpa_c = parseFloat(studentData.gpa || studentData.gpa_c || 0)
      }

      const params = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      }

      const response = await apperClient.updateRecord('students_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} students:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error updating student:", error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord('students_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} students:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0
      }

      return true
    } catch (error) {
      console.error("Error deleting student:", error?.response?.data?.message || error)
      return false
    }
  }
}