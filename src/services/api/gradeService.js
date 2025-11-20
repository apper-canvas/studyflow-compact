import { toast } from "react-toastify";
import React from "react";
import { getApperClient } from "@/services/apperClient";

const gradeToGPA = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "D-": 0.7,
  "F": 0.0
}

export const gradeService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('gradeEntries_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "courseId_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "gradePoint_c"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching grade entries:", error?.response?.data?.message || error)
      return []
    }
  },

  async getByCourseId(courseId) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('gradeEntries_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "courseId_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "gradePoint_c"}}
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
      console.error("Error fetching grade entries by course:", error?.response?.data?.message || error)
      return []
    }
  },

  async create(gradeData) {
    try {
      const apperClient = getApperClient()
      const gradePoint = gradeToGPA[gradeData.grade_c || gradeData.grade] || 0.0
      
      const params = {
        records: [{
          Name: `Grade for Course ${gradeData.courseId_c || gradeData.courseId}`,
          courseId_c: parseInt(gradeData.courseId_c || gradeData.courseId),
          credits_c: parseInt(gradeData.credits_c || gradeData.credits || 3),
          grade_c: gradeData.grade_c || gradeData.grade,
          gradePoint_c: gradePoint
        }]
      }

      const response = await apperClient.createRecord('gradeEntries_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} grade entries:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error creating grade entry:", error?.response?.data?.message || error)
      return null
    }
  },

  async calculateGPA(courseGrades = []) {
    try {
      if (!courseGrades.length) {
        courseGrades = await this.getAll()
      }
      
      const totalPoints = courseGrades.reduce((sum, grade) => {
        const gradePoint = grade.gradePoint_c || grade.gradePoint || 0
        const credits = grade.credits_c || grade.credits || 0
        return sum + (gradePoint * credits)
      }, 0)
      
      const totalCredits = courseGrades.reduce((sum, grade) => {
        const credits = grade.credits_c || grade.credits || 0
        return sum + credits
      }, 0)
      
      return totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0.0
    } catch (error) {
      console.error("Error calculating GPA:", error?.response?.data?.message || error)
      return 0.0
    }
  },

letterToGPA(letter) {
    return gradeToGPA[letter] || 0.0
  }
}