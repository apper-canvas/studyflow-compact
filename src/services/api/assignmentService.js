import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";

export const assignmentService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('assignments_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "maxPoints_c"}},
          {"field": {"Name": "weight_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "courseId_c"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching assignments:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.getRecordById('assignments_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "maxPoints_c"}},
          {"field": {"Name": "weight_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "courseId_c"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async getByCourseId(courseId) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('assignments_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "maxPoints_c"}},
          {"field": {"Name": "weight_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "courseId_c"}}
        ],
        where: [{
          "FieldName": "courseId_c",
          "Operator": "EqualTo",
          "Values": [parseInt(courseId)],
          "Include": true
        }]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching assignments by course:", error?.response?.data?.message || error)
      return []
    }
  },

  async create(assignmentData) {
    try {
      const apperClient = getApperClient()
      const params = {
        records: [{
          Name: assignmentData.title_c || assignmentData.title,
          title_c: assignmentData.title_c || assignmentData.title,
          description_c: assignmentData.description_c || assignmentData.description,
          courseId_c: parseInt(assignmentData.courseId_c || assignmentData.courseId),
          dueDate_c: assignmentData.dueDate_c || assignmentData.dueDate,
          priority_c: assignmentData.priority_c || assignmentData.priority || "medium",
          maxPoints_c: parseInt(assignmentData.maxPoints_c || assignmentData.maxPoints || 100),
          weight_c: parseFloat(assignmentData.weight_c || assignmentData.weight || 0.1),
          status_c: "pending",
          grade_c: null
        }]
      }

      const response = await apperClient.createRecord('assignments_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} assignments:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error creating assignment:", error?.response?.data?.message || error)
      return null
    }
  },

  async update(id, assignmentData) {
    try {
      const apperClient = getApperClient()
      const updateData = {}
      
      if (assignmentData.title_c !== undefined || assignmentData.title !== undefined) {
        updateData.Name = assignmentData.title_c || assignmentData.title
        updateData.title_c = assignmentData.title_c || assignmentData.title
      }
      if (assignmentData.description_c !== undefined || assignmentData.description !== undefined) {
        updateData.description_c = assignmentData.description_c || assignmentData.description
      }
      if (assignmentData.courseId_c !== undefined || assignmentData.courseId !== undefined) {
        updateData.courseId_c = parseInt(assignmentData.courseId_c || assignmentData.courseId)
      }
      if (assignmentData.dueDate_c !== undefined || assignmentData.dueDate !== undefined) {
        updateData.dueDate_c = assignmentData.dueDate_c || assignmentData.dueDate
      }
      if (assignmentData.priority_c !== undefined || assignmentData.priority !== undefined) {
        updateData.priority_c = assignmentData.priority_c || assignmentData.priority
      }
      if (assignmentData.maxPoints_c !== undefined || assignmentData.maxPoints !== undefined) {
        updateData.maxPoints_c = parseInt(assignmentData.maxPoints_c || assignmentData.maxPoints)
      }
      if (assignmentData.weight_c !== undefined || assignmentData.weight !== undefined) {
        updateData.weight_c = parseFloat(assignmentData.weight_c || assignmentData.weight)
      }
      if (assignmentData.status_c !== undefined || assignmentData.status !== undefined) {
        updateData.status_c = assignmentData.status_c || assignmentData.status
      }
      if (assignmentData.grade_c !== undefined || assignmentData.grade !== undefined) {
        updateData.grade_c = assignmentData.grade_c || assignmentData.grade
      }

      const params = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      }

      const response = await apperClient.updateRecord('assignments_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} assignments:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error updating assignment:", error?.response?.data?.message || error)
      return null
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord('assignments_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} assignments:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0
      }

      return true
    } catch (error) {
      console.error("Error deleting assignment:", error?.response?.data?.message || error)
      return false
    }
  },

  async toggleStatus(id) {
    try {
      // First get the current assignment
      const current = await this.getById(id)
      if (!current) {
        throw new Error("Assignment not found")
      }

      // Toggle status
      const newStatus = current.status_c === "completed" ? "pending" : "completed"
      
      return await this.update(id, { status_c: newStatus })
    } catch (error) {
      console.error("Error toggling assignment status:", error?.response?.data?.message || error)
      return null
    }
}
}