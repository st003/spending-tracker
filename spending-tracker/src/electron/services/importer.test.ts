import { expect, test } from 'vitest'

import { validateHeader } from './importer.js'

import type { CastingContext } from 'csv-parse'

test('validateHeader - invalid header check', () => {
  const ctx = { index: 0 }
  expect(() => validateHeader('invalidHeaderExample', ctx as CastingContext)).toThrowError()
})

test('validateHeader - paymentDate in correct position', () => {
  const ctx = { index: 0 }
  expect(validateHeader('paymentDate', ctx as CastingContext)).toBe('paymentDate')
})

test('validateHeader - paymentDate NOT in correct position', () => {
  const ctx = { index: 1 }
  expect(() => validateHeader('paymentDate', ctx as CastingContext)).toThrowError()
})

test('validateHeader - amount in correct position', () => {
  const ctx = { index: 1 }
  expect(validateHeader('amount', ctx as CastingContext)).toBe('amount')
})

test('validateHeader - amount NOT in correct position', () => {
  const ctx = { index: 2 }
  expect(() => validateHeader('amount', ctx as CastingContext)).toThrowError()
})

test('validateHeader - description in correct position', () => {
  const ctx = { index: 2 }
  expect(validateHeader('description', ctx as CastingContext)).toBe('description')
})

test('validateHeader - description NOT in correct position', () => {
  const ctx = { index: 3 }
  expect(() => validateHeader('description', ctx as CastingContext)).toThrowError()
})

test('validateHeader - categoryName in correct position', () => {
  const ctx = { index: 3 }
  expect(validateHeader('categoryName', ctx as CastingContext)).toBe('categoryName')
})

test('validateHeader - categoryName NOT in correct position', () => {
  const ctx = { index: 0 }
  expect(() => validateHeader('categoryName', ctx as CastingContext)).toThrowError()
})
