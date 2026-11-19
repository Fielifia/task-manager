export class RecurringTaskService {
  constructor(taskRepository, dateProvider) {
    this.taskRepository = taskRepository
    this.dateProvider = dateProvider
  }
}
