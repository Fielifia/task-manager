export class TaskValidationService {
  isValidTitle(title) {
    return typeof title === 'string' && title.trim().length > 0
  }

  isValidPriority(priority) {
    const validPriorities = ['Low', 'Normal', 'High']

    return validPriorities.includes(priority)
  }
}
