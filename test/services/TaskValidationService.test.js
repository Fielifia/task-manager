import { test } from 'node:test'
import assert from 'node:assert/strict'

import { TaskValidationService } from '../../src/services/TaskValidationService.js'

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

