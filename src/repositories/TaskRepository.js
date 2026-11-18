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

  async delete(taskId) {
    return this.taskModel.findByIdAndDelete(taskId)
  }

  async archive(taskId) {
    return this.taskModel.findByIdAndUpdate(
      taskId,
      { isArchived: true },
      { new: true }
    )
  }

  async restore(taskId) {
    return this.taskModel.findByIdAndUpdate(
      taskId,
      { isArchived: false },
      { new: true }
    )
  }
}
