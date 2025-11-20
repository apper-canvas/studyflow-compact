import gradeEntriesData from "@/services/mockData/gradeEntries.json"

let gradeEntries = [...gradeEntriesData]

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))

const gradeToGPA = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "D-": 0.7,
  "F": 0.0
}

export const gradeService = {
  async getAll() {
    await delay()
    return [...gradeEntries]
  },

  async getByCourseId(courseId) {
    await delay()
    return gradeEntries.filter(g => g.courseId === parseInt(courseId)).map(g => ({ ...g }))
  },

  async create(gradeData) {
    await delay()
    const gradePoint = gradeToGPA[gradeData.grade] || 0.0
    const newGrade = {
      ...gradeData,
      gradePoint
    }
    gradeEntries.push(newGrade)
    return { ...newGrade }
  },

  async calculateGPA(courseGrades = []) {
    await delay()
    if (!courseGrades.length) {
      courseGrades = gradeEntries
    }
    
    const totalPoints = courseGrades.reduce((sum, grade) => sum + (grade.gradePoint * grade.credits), 0)
    const totalCredits = courseGrades.reduce((sum, grade) => sum + grade.credits, 0)
    
    return totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0.0
  },

  letterToGPA(letter) {
    return gradeToGPA[letter] || 0.0
  }
}