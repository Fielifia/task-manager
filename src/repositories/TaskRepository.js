export class TaskRepository {
  constructor(taskModel) {
    this.taskModel = taskModel
  }

  async save(taskData) {
    return this.taskModel.create(taskData)
  }
}
