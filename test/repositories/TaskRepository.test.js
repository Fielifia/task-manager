import { test } from 'node:test'
import assert from 'node:assert/strict'
import sinon from 'sinon'
import { TaskRepository } from '../../src/repositories/TaskRepository.js'

function createTaskRepository() {
  const taskModel = {
    create: sinon.stub(),
    findById: sinon.stub(),
    findByIdAndUpdate: sinon.stub()
  }

  const taskRepository = new TaskRepository(taskModel)

  return {
    taskRepository,
    taskModel
  }
}

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

  const { taskRepository, taskModel } = createTaskRepository()

  taskModel.create.resolves(savedTask)

  const result = await taskRepository.save(taskData)

  assert.equal(taskModel.create.calledOnce, true)
  assert.deepEqual(taskModel.create.firstCall.args[0], taskData)
  assert.deepEqual(result, savedTask)
})

test('should propagate errors when saving a task fails', async () => {
  const error = new Error('Database error')

  const { taskRepository, taskModel } = createTaskRepository()

  taskModel.create.rejects(error)

  await assert.rejects(
    taskRepository.save({
      title: 'Complete project'
    }),
    (receivedError) => receivedError === error
  )

  assert.equal(taskModel.create.calledOnce, true)
})

test('should find a task by its ID', async () => {
  const taskId = 'task-123'

  const foundTask = {
    _id: taskId,
    title: 'Complete project',
    priority: 'Normal',
    status: 'To do'
  }

  const { taskRepository, taskModel } = createTaskRepository()

  taskModel.findById.resolves(foundTask)

  const result = await taskRepository.findById(taskId)

  assert.equal(taskModel.findById.calledOnce, true)
  assert.equal(taskModel.findById.firstCall.args[0], taskId)
  assert.deepEqual(result, foundTask)
})

test('should return null when a task is not found', async () => {
  const taskId = 'nonexistent-task'

  const { taskRepository, taskModel } = createTaskRepository()

  taskModel.findById.resolves(null)

  const result = await taskRepository.findById(taskId)

  assert.equal(taskModel.findById.calledOnce, true)
  assert.equal(taskModel.findById.firstCall.args[0], taskId)
  assert.equal(result, null)
})

test('should update a task using its ID and updated data', async () => {
  const taskId = 'task-123'

  const updatedData = {
    title: 'Update project',
    priority: 'High',
    status: 'In progress'
  }

  const updatedTask = {
    _id: taskId,
    ...updatedData
  }

  const { taskRepository, taskModel } = createTaskRepository()

  taskModel.findByIdAndUpdate.resolves(updatedTask)

  const result = await taskRepository.update(taskId, updatedData)

  assert.equal(taskModel.findByIdAndUpdate.calledOnce, true)

  assert.deepEqual(
    taskModel.findByIdAndUpdate.firstCall.args,
    [taskId, updatedData, { new: true }]
  )

  assert.deepEqual(result, updatedTask)
})

test('should return null when updating a task that does not exist', async () => {
  const taskId = 'nonexistent-task'

  const updatedData = {
    title: 'Update project'
  }

  const { taskRepository, taskModel } = createTaskRepository()

  taskModel.findByIdAndUpdate.resolves(null)

  const result = await taskRepository.update(taskId, updatedData)

  assert.equal(taskModel.findByIdAndUpdate.calledOnce, true)

  assert.deepEqual(
    taskModel.findByIdAndUpdate.firstCall.args,
    [taskId, updatedData, { new: true }]
  )

  assert.equal(result, null)

})
