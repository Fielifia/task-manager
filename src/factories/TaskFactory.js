export class TaskFactory {
  constructor(taskConstructor) {
    this.taskConstructor = taskConstructor
  }

  create(taskData) {
    return new this.taskConstructor(taskData)
  }
}
