import { expect, test } from 'vitest'

import { validateDateString, validateHeader } from './importer.js'

import type { CastingContext } from 'csv-parse'

test('validateHeader - invalid header check', () => {
  const ctx = { index: 0 } as CastingContext
  expect(() => validateHeader('invalidHeaderExample', ctx)).toThrowError()
})

test('validateHeader - paymentDate in correct position', () => {
  const ctx = { index: 0 } as CastingContext
  expect(validateHeader('paymentDate', ctx)).toBe('paymentDate')
})

test('validateHeader - paymentDate NOT in correct position', () => {
  const ctx = { index: 1 } as CastingContext
  expect(() => validateHeader('paymentDate', ctx)).toThrowError()
})

test('validateHeader - amount in correct position', () => {
  const ctx = { index: 1 } as CastingContext
  expect(validateHeader('amount', ctx)).toBe('amount')
})

test('validateHeader - amount NOT in correct position', () => {
  const ctx = { index: 2 } as CastingContext
  expect(() => validateHeader('amount', ctx)).toThrowError()
})

test('validateHeader - description in correct position', () => {
  const ctx = { index: 2 } as CastingContext
  expect(validateHeader('description', ctx)).toBe('description')
})

test('validateHeader - description NOT in correct position', () => {
  const ctx = { index: 3 } as CastingContext
  expect(() => validateHeader('description', ctx)).toThrowError()
})

test('validateHeader - categoryName in correct position', () => {
  const ctx = { index: 3 } as CastingContext
  expect(validateHeader('categoryName', ctx)).toBe('categoryName')
})

test('validateHeader - categoryName NOT in correct position', () => {
  const ctx = { index: 0 } as CastingContext
  expect(() => validateHeader('categoryName', ctx)).toThrowError()
})

test('validateDateString - valid ISO string', () => {
  const ctx = { index: 0, lines: 1 } as CastingContext
  expect(validateDateString('2000-01-01', ctx)).toBe('2000-01-01')
})

test('validateDateString - valid mm/dd/yyyy string', () => {
  const ctx = { index: 0, lines: 1 } as CastingContext
  expect(validateDateString('1/1/2000', ctx)).toBe('2000-01-01')
})

test('validateDateString - empty date', () => {
  const ctx = { index: 0, lines: 1 } as CastingContext
  expect(() => validateDateString('', ctx)).toThrowError()
})
