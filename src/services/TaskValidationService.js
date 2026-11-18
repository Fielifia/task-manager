const VALID_PRIORITIES = ['Low', 'Normal', 'High']
const VALID_STATUSES = ['To do', 'In progress', 'Done']

export class TaskValidationService {
  isValidTitle(title) {
    return typeof title === 'string' && title.trim().length > 0
  }

  isValidPriority(priority) {
    return VALID_PRIORITIES.includes(priority)
  }

  isValidStatus(status) {
    return VALID_STATUSES.includes(status)
  }
}
