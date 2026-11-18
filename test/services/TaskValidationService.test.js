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
test('should accept Low as a valid priority', () => {
  const validationService = new TaskValidationService()

  assert.equal(validationService.isValidPriority('Low'), true)
})

test('should accept Normal as a valid priority', () => {
  const validationService = new TaskValidationService()

  assert.equal(validationService.isValidPriority('Normal'), true)
})

test('should accept High as a valid priority', () => {
  const validationService = new TaskValidationService()

  assert.equal(validationService.isValidPriority('High'), true)
})

// Task status validation tests
test('should accept To do as a valid status', () => {
  const validationService = new TaskValidationService()

  assert.equal(validationService.isValidStatus('To do'), true)
})

test('should accept In progress as a valid status', () => {
  const validationService = new TaskValidationService()

  assert.equal(validationService.isValidStatus('In progress'), true)
})

test('should accept Done as a valid status', () => {
  const validationService = new TaskValidationService()

  assert.equal(validationService.isValidStatus('Done'), true)
})
