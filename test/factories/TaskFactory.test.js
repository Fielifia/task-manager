import { test } from 'node:test'
import assert from 'node:assert/strict'
import { TaskFactory } from '../../src/factories/TaskFactory.js'

test('should create a Task with the provided data', () => {
  class FakeTask {
    constructor(taskData) {
      Object.assign(this, taskData)
    }
  }

  const taskData = {
    title: 'Complete project',
    priority: 'HIGH',
    status: 'IN_PROGRESS'
  }

  const taskFactory = new TaskFactory(FakeTask)

  const result = taskFactory.create(taskData)

  assert.equal(result instanceof FakeTask, true)
  assert.equal(result.title, taskData.title)
  assert.equal(result.priority, taskData.priority)
  assert.equal(result.status, taskData.status)

})
