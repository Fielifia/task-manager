import { test } from 'node:test'
import assert from 'node:assert/strict'
import sinon from 'sinon'
import { TaskService } from '../../src/services/TaskService.js'

test('creates a task with default priority and status', async () => {
  const taskRepository = {
    save: sinon.stub().resolves({
      title: 'Complete project',
      priority: 'Normal',
      status: 'To do'
    })
  }

  const taskValidationService = {
    isValidTitle: sinon.stub().returns(true),
    isValidPriority: sinon.stub().returns(true),
    isValidStatus: sinon.stub().returns(true)
  }

  const taskService = new TaskService(
    taskRepository,
    taskValidationService
  )

  await taskService.createTask({
    title: 'Complete project'
  })

  assert.equal(taskRepository.save.calledOnce, true)

  assert.deepEqual(taskRepository.save.firstCall.args[0], {
    title: 'Complete project',
    priority: 'Normal',
    status: 'To do'
  })
})
