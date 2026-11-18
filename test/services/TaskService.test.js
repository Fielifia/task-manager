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
    update: sinon.stub(),
    delete: sinon.stub()
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

// Task creation tests
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

// Task retrieval tests
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

  assert.equal(result, null)
})

// Task update tests
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

test('should return null when a task does not exist', async () => {
  const taskId = 'nonexistent-task'

  const updatedData = {
    title: 'Update project'
  }

  const { taskService, taskRepository } = createTaskService()

  taskRepository.update.resolves(null)

  const result = await taskService.updateTask(taskId, updatedData)

  assert.equal(taskRepository.update.calledOnce, true)
  assert.deepEqual(
    taskRepository.update.firstCall.args,
    [taskId, updatedData]
  )
  assert.equal(result, null)
})

test('should reject an update with an empty title', async () => {
  const taskId = 'task-123'

  const updatedData = {
    title: '    '
  }

  const {
    taskService,
    taskRepository
  } = createTaskService({
    isValidTitle: false
  })

  await assert.rejects(
    taskService.updateTask(taskId, updatedData),
    /Invalid task title/
  )

  assert.equal(taskRepository.update.called, false)
})

test('should reject an update with an invalid priority', async () => {
  const taskId = 'task-123'

  const updatedData = {
    priority: 'Urgent'
  }

  const {
    taskService,
    taskRepository
  } = createTaskService({
    isValidPriority: false
  })

  await assert.rejects(
    taskService.updateTask(taskId, updatedData),
    /Invalid task priority/
  )

  assert.equal(taskRepository.update.called, false)
})

test('should reject an update with an invalid status', async () => {
  const taskId = 'task-123'

  const updatedData = {
    status: 'Completed'
  }

  const {
    taskService,
    taskRepository
  } = createTaskService({
    isValidStatus: false
  })

  await assert.rejects(
    taskService.updateTask(taskId, updatedData),
    /Invalid task status/
  )

  assert.equal(taskRepository.update.called, false)
})

// Task deletion tests
test('should delegate task deletion to the repository', async () => {
  const taskId = 'task-123'

  const deletedTask = {
    _id: taskId,
    title: 'Task to delete'
  }

  const { taskService, taskRepository } = createTaskService()

  taskRepository.delete.resolves(deletedTask)

  const result = await taskService.deleteTask(taskId)

  assert.equal(taskRepository.delete.calledOnceWith(taskId), true)
  assert.equal(result, deletedTask)
})
