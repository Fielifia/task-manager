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
