import { test } from 'node:test'
import assert from 'node:assert/strict'
import sinon from 'sinon'
import { TaskService } from '../../src/services/TaskService.js'

function createTaskService({
  isValidTitle = true,
  isValidPriority = true,
  isValidStatus = true
} = {}) {
  const taskRepository = {
    save: sinon.stub()
  }

  const taskValidationService = {
    isValidTitle: sinon.stub().returns(isValidTitle),
    isValidPriority: sinon.stub().returns(isValidPriority),
    isValidStatus: sinon.stub().returns(isValidStatus)
  }

  const taskService = new TaskService(
    taskRepository,
    taskValidationService
  )

  return {
    taskService,
    taskRepository,
    taskValidationService
  }
}

test('creates a task with default priority and status', async () => {
  const {
    taskService,
    taskRepository,
    taskValidationService
  } = createTaskService()

  await taskService.createTask({
    title: 'Complete project'
  })

  assert.equal(taskRepository.save.calledOnce, true)

  assert.equal(
    taskValidationService.isValidPriority.calledWith('Normal'),
    true
  )

  assert.equal(
    taskValidationService.isValidStatus.calledWith('To do'),
    true
  )

  assert.deepEqual(taskRepository.save.firstCall.args[0], {
    title: 'Complete project',
    priority: 'Normal',
    status: 'To do'
  })
})

test('should reject a task with an empty title', async () => {
  const {
    taskService,
    taskRepository
  } = createTaskService({
    isValidTitle: false
  })

  await assert.rejects(
    taskService.createTask({ title: '' }),
    /Invalid task title/
  )

  assert.equal(taskRepository.save.called, false)
})

test('should reject a task with an invalid priority', async () => {
  const {
    taskService,
    taskRepository
  } = createTaskService({
    isValidPriority: false
  })

  await assert.rejects(
    taskService.createTask({
      title: 'Complete project',
      priority: 'Urgent'
    }),
    /Invalid task priority/
  )

  assert.equal(taskRepository.save.called, false)
})

test('should reject a task with an invalid status', async () => {
  const {
    taskService,
    taskRepository
  } = createTaskService({
    isValidStatus: false
  })

  await assert.rejects(
    taskService.createTask({
      title: 'Complete project',
      status: 'Completed'
    }),
    /Invalid task status/
  )

  assert.equal(taskRepository.save.called, false)
})
