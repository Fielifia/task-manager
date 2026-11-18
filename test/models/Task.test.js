import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Task } from '../../src/models/Task.js'

test('should create a Task with the provided data', () => {
  const taskData = {
    title: 'Complete project',
    description: 'Finish the testing assignment',
    priority: 'High',
    status: 'In progress'
  }

  const task = new Task(taskData)

  assert.equal(task instanceof Task, true)
  assert.equal(task.title, taskData.title)
  assert.equal(task.description, taskData.description)
  assert.equal(task.priority, taskData.priority)
  assert.equal(task.status, taskData.status)
})
  
test('should apply default values when optional properties are omitted', () => {
  const task = new Task ({
    title: 'Complete project',
  })

  assert.equal(task.title, 'Complete project')
  assert.equal(task.description, null)
  assert.equal(task.dueDate, null)
  assert.equal(task.priority, 'NORMAL')
  assert.equal(task.status, 'TODO')
  assert.equal(task.categoryId, null)
  assert.equal(task.recurrence, null)
  assert.equal(task.tags, [])
  assert.equal(task.completedAt, null)
  assert.equal(task.archivedAt, null)
})
