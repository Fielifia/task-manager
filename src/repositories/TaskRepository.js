export class TaskRepository {
  constructor(taskModel) {
    this.taskModel = taskModel
  }

  async save(taskData) {
    return this.taskModel.create(taskData)
  }

  async findById(taskId) {
    return this.taskModel.findById(taskId)
  }

  async update(taskId, updatedData) {
    return this.taskModel.findByIdAndUpdate(
      taskId,
      updatedData,
      { new: true }

    )
  }
}
