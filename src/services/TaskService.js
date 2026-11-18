export class TaskService {
  constructor(taskRepository, taskValidationService) {
    this.taskRepository = taskRepository
    this.taskValidationService = taskValidationService
  }

  async createTask(taskData) {
    const task = {
      ...taskData,
      priority: taskData.priority ?? 'Normal',
      status: taskData.status ?? 'To do'
    }

    return this.taskRepository.save(task)
  }
}
