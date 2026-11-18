export class TaskService {
  constructor(taskRepository, taskValidationService) {
    this.taskRepository = taskRepository
    this.taskValidationService = taskValidationService
  }

  async createTask(taskData) {
    if (!this.taskValidationService.isValidTitle(taskData.title)) {
      throw new Error('Invalid task title')
    }

    const task = {
      ...taskData,
      priority: taskData.priority ?? 'Normal',
      status: taskData.status ?? 'To do'
    }

    if (!this.taskValidationService.isValidPriority(task.priority)) {
      throw new Error('Invalid task priority')
    }

    if (!this.taskValidationService.isValidStatus(task.status)) {
      throw new Error('Invalid task status')
    }

    return this.taskRepository.save(task)
  }

  async getTaskById(taskId) {
    return this.taskRepository.findById(taskId)
  }

  async updateTask(taskId, updatedData) {
    const validationRules = {
      title: {
        validate: this.taskValidationService.isValidTitle,
        error: 'Invalid task title'
      },
      priority: {
        validate: this.taskValidationService.isValidPriority,
        error: 'Invalid task priority'
      },
      status: {
        validate: this.taskValidationService.isValidStatus,
        error: 'Invalid task status'
      }
    }

    for (const [field, rule] of Object.entries(validationRules)) {
      if (
        field in updatedData &&
        !rule.validate(updatedData[field])
      ) {
        throw new Error(rule.error)
      }
    }

    return this.taskRepository.update(taskId, updatedData)
  }

  async deleteTask(taskId) {
    return this.taskRepository.delete(taskId)
  }

  async archiveTask(taskId) {
    return this.taskRepository.archive(taskId)
  }
}
