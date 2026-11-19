import { test } from 'node:test'
import assert from 'node:assert/strict'
import sinon from 'sinon'
import { TaskService } from '../../src/services/TaskService.js'

function createTaskService({
  validTitle = true,
  validPriority = true,
  validStatus = true
} = {}) {
  const taskRepository = {
    save: sinon.stub(),
    findById: sinon.stub(),
    update: sinon.stub(),
    delete: sinon.stub(),
    archive: sinon.stub(),
    restore: sinon.stub()
  }

  const taskValidationService = {
    isValidTitle: sinon.stub().returns(validTitle),
    isValidPriority: sinon.stub().returns(validPriority),
    isValidStatus: sinon.stub().returns(validStatus)
  }

  const taskFactory = {
    create: sinon.stub().callsFake(taskData => taskData)
  }

  const taskService = new TaskService(
    taskRepository,
    taskValidationService,
    taskFactory
  )

  return {
    taskService,
    taskRepository,
    taskValidationService,
    taskFactory
  }
}

// Task creation tests
test('should pass task data to the TaskFactory when creating a task', async () => {
  const taskData = {
    title: 'Complete project'
  }

  const {
    taskService,
    taskRepository,
    taskValidationService,
    taskFactory
  } = createTaskService()

  await taskService.createTask(taskData)

  assert.equal(taskFactory.create.calledOnceWith(taskData), true)
  assert.equal(taskRepository.save.calledOnceWith(taskFactory.create.returnValues[0]),
    true)

  assert.equal(
    taskValidationService.isValidTitle.calledOnceWith(taskData.title),
    true
  )
})

test('should create a task using the injected TaskFactory', async () => {
  const taskData = {
    title: 'Complete project',
    priority: 'HIGH',
    status: 'IN_PROGRESS'
  }

  const createdTask = { ...taskData }

  const taskRepository = {
    save: sinon.stub().resolves(createdTask)
  }

  const taskValidationService = {
    isValidTitle: sinon.stub().returns(true),
    isValidPriority: sinon.stub().returns(true),
    isValidStatus: sinon.stub().returns(true)
  }

  const taskFactory = {
    create: sinon.stub().returns(createdTask)
  }

  const taskService = new TaskService(
    taskRepository,
    taskValidationService,
    taskFactory
  )

  await taskService.createTask(taskData)

  assert.equal(taskFactory.create.calledOnceWith(taskData), true)
  assert.equal(taskRepository.save.calledOnceWith(createdTask), true)
})

test('should reject a task with an empty title', async () => {
  const {
    taskService,
    taskRepository
  } = createTaskService({
    validTitle: false
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
    validPriority: false
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
    validStatus: false
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
test('should return the task matching the provided ID', async () => {
  const taskId = 'task-123'

  const foundTask = {
    _id: taskId,
    title: 'Complete project',
    priority: 'NORMAL',
    status: 'TODO'
  }

  const { taskService, taskRepository } = createTaskService()

  taskRepository.findById.resolves(foundTask)

  const result = await taskService.getTaskById(taskId)

  assert.equal(taskRepository.findById.calledOnce, true)
  assert.deepEqual(taskRepository.findById.firstCall.args, [taskId])
  assert.deepEqual(result, foundTask)
})

test('should return null when retrieving a task that does not exist', async () => {
  const { taskService, taskRepository } = createTaskService()

  taskRepository.findById.resolves(null)

  const result = await taskService.getTaskById('task-123')

  assert.equal(taskRepository.findById.calledOnceWith('task-123'), true)
  assert.equal(result, null)
})

// Task update tests
test('should pass the task ID and updated data to the repository', async () => {
  const taskId = 'task-123'

  const updatedData = {
    title: 'Update project',
    priority: 'HIGH'
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

test('should return null when updating a task that does not exist', async () => {
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
    validTitle: false
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
    validPriority: false
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
    validStatus: false
  })

  await assert.rejects(
    taskService.updateTask(taskId, updatedData),
    /Invalid task status/
  )

  assert.equal(taskRepository.update.called, false)
})

// Task deletion tests
test('should pass the task ID to the repository when deleting a task', async () => {
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

test('should return null when deleting a task that does not exist', async () => {
  const taskId = 'nonexistent-task'

  const { taskService, taskRepository } = createTaskService()

  taskRepository.delete.resolves(null)

  const result = await taskService.deleteTask(taskId)

  assert.equal(taskRepository.delete.calledOnceWith(taskId), true)
  assert.equal(result, null)
})

// Task archive tests
test('should archive a task by its ID', async () => {
  const taskId = 'task-123'

  const archivedTask = {
    _id: taskId,
    title: 'Task to archive',
    archivedAt: new Date('2026-11-18T10:00:00.000Z')
  }

  const { taskService, taskRepository } = createTaskService()

  taskRepository.archive.resolves(archivedTask)

  const result = await taskService.archiveTask(taskId)

  assert.equal(taskRepository.archive.calledOnceWith(taskId), true)
  assert.equal(result, archivedTask)
})

test('should return null when archiving a task that does not exist', async () => {
  const taskId = 'nonexistent-task'

  const { taskService, taskRepository } = createTaskService()

  taskRepository.archive.resolves(null)

  const result = await taskService.archiveTask(taskId)

  assert.equal(taskRepository.archive.calledOnceWith(taskId), true)
  assert.equal(result, null)
})

test('should restore an archived task by its ID', async () => {
  const taskId = 'task-123'

  const restoredTask = {
    _id: taskId,
    title: 'Restored task',
    archivedAt: null
  }

  const { taskService, taskRepository } = createTaskService()

  taskRepository.restore.resolves(restoredTask)

  const result = await taskService.restoreTask(taskId)

  assert.equal(taskRepository.restore.calledOnceWith(taskId), true)
  assert.equal(result, restoredTask)
})

test('should return null when restoring a task that does not exist', async () => {
  const taskId = 'nonexistent-task'

  const { taskService, taskRepository } = createTaskService()

  taskRepository.restore.resolves(null)

  const result = await taskService.restoreTask(taskId)

  assert.equal(taskRepository.restore.calledOnceWith(taskId), true)
  assert.equal(result, null)
})

test('should complete a task by setting its status and completion time', async () => {
  const taskId = 'task-123'
  const completedAt = new Date('2026-11-18T10:00:00.000Z')
  const clock = sinon.useFakeTimers({ now: completedAt })

  try {
    const completedTask = {
      _id: taskId,
      title: 'Complete project',
      status: 'DONE',
      completedAt
    }

    const { taskService, taskRepository } = createTaskService()

    taskRepository.update.resolves(completedTask)

    const result = await taskService.completeTask(taskId)

    assert.equal(taskRepository.update.calledOnceWith(
      taskId,
      {
        status: 'DONE',
        completedAt
      }
    ),
      true
    )

    assert.equal(result, completedTask)
  } finally {
    clock.restore()
  }
})

test('should return null when completing a task that does not exist', async () => {
  const taskId = 'nonexistent-task'

  const { taskService, taskRepository } = createTaskService()

  taskRepository.update.resolves(null)

  const result = await taskService.completeTask(taskId)


  assert.equal(
    taskRepository.update.calledOnceWith(
      taskId,
      {
        status: 'DONE',
        completedAt: sinon.match.date
      }
    ),
    true
  )
  assert.equal(result, null)
})
