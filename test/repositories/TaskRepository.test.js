import { test } from 'node:test'
import assert from 'node:assert/strict'
import sinon from 'sinon'
import { TaskRepository } from '../../src/repositories/TaskRepository.js'

test('should save a task using the injected model', async () => {
  const taskData = {
    title: 'Complete project',
    priority: 'Normal',
    status: 'To do'
  }

  const savedTask = {
    _id: 'task-123',
    ...taskData
  }

  const taskModel = {
    create: sinon.stub().resolves(savedTask)
  }

  const taskRepository = new TaskRepository(taskModel)

  const result = await taskRepository.save(taskData)

  assert.equal(taskModel.create.calledOnce, true)
  assert.deepEqual(taskModel.create.firstCall.args[0], taskData)
  assert.deepEqual(result, savedTask)
})
