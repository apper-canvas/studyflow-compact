import { getApperClient } from '@/services/apperClient'
import { toast } from 'react-toastify'

export const courseService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('courses_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "code_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "currentGrade_c"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching courses:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.getRecordById('courses_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "code_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "currentGrade_c"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async create(courseData) {
    try {
      const apperClient = getApperClient()
      const params = {
        records: [{
          Name: courseData.name || courseData.Name,
          code_c: courseData.code || courseData.code_c,
          instructor_c: courseData.instructor || courseData.instructor_c,
          credits_c: parseInt(courseData.credits || courseData.credits_c || 3),
          color_c: courseData.color || courseData.color_c || "#4f46e5",
          semester_c: courseData.semester || courseData.semester_c || "Fall 2024",
          currentGrade_c: parseFloat(courseData.currentGrade || courseData.currentGrade_c || 0)
        }]
      }

      const response = await apperClient.createRecord('courses_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} courses:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error creating course:", error?.response?.data?.message || error)
      return null
    }
  },

  async update(id, courseData) {
    try {
      const apperClient = getApperClient()
      const updateData = {}
      
      if (courseData.name !== undefined || courseData.Name !== undefined) {
        updateData.Name = courseData.name || courseData.Name
      }
      if (courseData.code !== undefined || courseData.code_c !== undefined) {
        updateData.code_c = courseData.code || courseData.code_c
      }
      if (courseData.instructor !== undefined || courseData.instructor_c !== undefined) {
        updateData.instructor_c = courseData.instructor || courseData.instructor_c
      }
      if (courseData.credits !== undefined || courseData.credits_c !== undefined) {
        updateData.credits_c = parseInt(courseData.credits || courseData.credits_c)
      }
      if (courseData.color !== undefined || courseData.color_c !== undefined) {
        updateData.color_c = courseData.color || courseData.color_c
      }
      if (courseData.semester !== undefined || courseData.semester_c !== undefined) {
        updateData.semester_c = courseData.semester || courseData.semester_c
      }
      if (courseData.currentGrade !== undefined || courseData.currentGrade_c !== undefined) {
        updateData.currentGrade_c = parseFloat(courseData.currentGrade || courseData.currentGrade_c)
      }

      const params = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      }

      const response = await apperClient.updateRecord('courses_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} courses:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error updating course:", error?.response?.data?.message || error)
      return null
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord('courses_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} courses:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0
      }

      return true
    } catch (error) {
      console.error("Error deleting course:", error?.response?.data?.message || error)
      return false
    }
  }
}