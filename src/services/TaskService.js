export class TaskService {
  constructor(taskRepository, taskValidationService) {
    this.taskRepository = taskRepository
    this.taskValidationService = taskValidationService
  }

  async createTask(task) { }
}
