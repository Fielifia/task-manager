import { test } from 'node:test'
import assert from 'node:assert/strict'
import sinon from 'sinon'
import { RecurringTaskService } from '../../src/services/RecurringTaskService.js'

function createRecurringTaskService() {
  const taskRepository = {
    save: sinon.stub()
  }

  const dateProvider = sinon.stub().returns(new Date('2026-11-19T12:00:00:00'))

  const recurringTaskService = new RecurringTaskService(
    taskRepository,
    dateProvider
  )

  return {
    recurringTaskService,
    taskRepository,
    dateProvider
  }
}

test('calculateNextDueDate should add one day for daily recurrence', () => {
  const { recurringTaskService } = createRecurringTaskService()

  const dueDate = new Date('2026-11-19T12:00:00')
  const recurrence = {
    unit: 'DAY',
    interval: 1
  }

  const nextDueDate = recurringTaskService.calculateNextDueDate(
    dueDate,
    recurrence
  )

  assert.deepStrictEqual(
    nextDueDate,
    new Date('2026-11-19T12:00:00')
  )
})
