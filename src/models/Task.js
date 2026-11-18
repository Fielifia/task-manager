export class Task {
  constructor(taskData) {
    this.title = taskData.title
    this.description = taskData.description ?? null
    this.dueDate = taskData.dueDate ?? null
    this.priority = taskData.priority ?? 'NORMAL'
    this.status = taskData.status ?? 'TODO'
    this.categoryId = taskData.categoryId ?? null
    this.recurrence = taskData.recurrence ?? null
    this.tags = taskData.tags ?? []
    this.completedAt = taskData.completedAt ?? null
    this.archivedAt = taskData.archivedAt ?? null
  }
}
