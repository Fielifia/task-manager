import { test } from 'node:test'
import assert from 'node:assert/strict'

import { TaskValidationService } from '../../src/services/TaskValidationService.js'

// Task title validation tests

test('should reject an empty task title', () => {
  const validationService = new TaskValidationService()

  assert.equal(validationService.isValidTitle(''), false)
})

test('should reject a task title containing only whitespace', () => {
  const validationService = new TaskValidationService()

  assert.equal(validationService.isValidTitle('   '), false)
})

test('should accept a task title containing text', () => {
  const validationService = new TaskValidationService()

  assert.equal(validationService.isValidTitle('Complete project'), true)
})

test('should reject null as a task title', () => {
  const validationService = new TaskValidationService()

  assert.equal(validationService.isValidTitle(null), false)
})

test('should reject undefined as a task title', () => {
  const validationService = new TaskValidationService()

  assert.equal(validationService.isValidTitle(undefined), false)
})

test('should reject a number as a task title', () => {
  const validationService = new TaskValidationService()

  assert.equal(validationService.isValidTitle(123), false)
})

// Task priority validation tests
test('should accept LOW as a valid priority', () => {
  const validationService = new TaskValidationService()

  assert.equal(validationService.isValidPriority('LOW'), true)
})

test('should accept NORMAL as a valid priority', () => {
  const validationService = new TaskValidationService()

  assert.equal(validationService.isValidPriority('NORMAL'), true)
})

test('should accept HIGH as a valid priority', () => {
  const validationService = new TaskValidationService()

  assert.equal(validationService.isValidPriority('HIGH'), true)
})

// Task status validation tests
test('should accept TODO as a valid status', () => {
  const validationService = new TaskValidationService()

  assert.equal(validationService.isValidStatus('TODO'), true)
})

test('should accept IN_PROGRESS as a valid status', () => {
  const validationService = new TaskValidationService()

  assert.equal(validationService.isValidStatus('IN_PROGRESS'), true)
})

test('should accept DONE as a valid status', () => {
  const validationService = new TaskValidationService()

  assert.equal(validationService.isValidStatus('DONE'), true)
})
