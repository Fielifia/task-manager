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

test('should reject a task with an empty title', async () => {
  const taskRepository = {
    save: sinon.stub()
  }

  const taskValidationService = {
    isValidTitle: sinon.stub().returns(false),
  }

  const taskService = new TaskService(
    taskRepository,
    taskValidationService
  )

  await assert.rejects(
    taskService.createTask({ title: '' }),
    /Invalid task title/
  )

  assert.equal(taskRepository.save.called, false)
})

test('should reject a task with an invalid priority', async () => {
  const taskRepository = {
    save: sinon.stub()
  }

  const taskValidationService = {
    isValidTitle: sinon.stub().returns(true),
    isValidPriority: sinon.stub().returns(false),
  }

  const taskService = new TaskService(
    taskRepository,
    taskValidationService
  )

  await assert.rejects(
    taskService.createTask({
      title: 'Complete project',
      priority: 'Urgent'
    }),
    /Invalid task priority/
  )

  assert.equal(taskRepository.save.called, false)
})
