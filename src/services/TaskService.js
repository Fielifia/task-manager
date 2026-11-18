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

    if (!this.taskValidationService.isValidPriority(taskData.priority)) {
      throw new Error('Invalid task priority')
    }

    return this.taskRepository.save(task)
  }
}
