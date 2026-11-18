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
    save: sinon.stub(),
    findById: sinon.stub(),
    update: sinon.stub()
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

test('should return a task by its ID', async () => {
  const taskId = 'task-123'

  const foundTask = {
    _id: taskId,
    title: 'Complete project',
    priority: 'Normal',
    status: 'To do'
  }

  const { taskService, taskRepository } = createTaskService()

  taskRepository.findById.resolves(foundTask)

  const result = await taskService.getTaskById(taskId)

  assert.equal(taskRepository.findById.calledOnce, true)
  assert.deepEqual(taskRepository.findById.firstCall.args, [taskId])
  assert.deepEqual(result, foundTask)
})

test('should return null when a task is not found', async () => {
  const { taskService, taskRepository } = createTaskService()

  taskRepository.findById.resolves(null)

  const result = await taskService.getTaskById('task-123')

  assert.deepEqual(result, null)
})

test('should delegate task updates to the repository', async () => {
  const taskId = 'task-123'

  const updatedData = {
    title: 'Update project',
    priority: 'High'
  }

  const { taskService, taskRepository } = createTaskService()

  const updatedTask = {
    _id: taskId,
    ...updatedData
  }

  taskRepository.update.resolves(updatedTask)

  const result = await taskService.updateTask(taskId, updatedData)

  assert.equal(taskRepository.update.calledOnce, true)
  assert.deepEqual(
    taskRepository.update.firstCall.args,
    [taskId, updatedData]
  )
  assert.deepEqual(result, updatedTask)
})
