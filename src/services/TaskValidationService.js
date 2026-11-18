const VALID_PRIORITIES = ['LOW', 'NORMAL', 'HIGH']
const VALID_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE']

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
