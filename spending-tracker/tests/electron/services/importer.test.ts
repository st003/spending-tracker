import { expect, test } from 'vitest'

import {
  castToCents,
  parseCSV,
  validateDateString,
  validateHeader
} from '../../../src/electron/services/importer.js'

import type { InfoField } from 'csv-parse'

test('validateHeader - invalid header check', () => {
  const ctx = { index: 0 } as InfoField
  expect(() => validateHeader('invalidHeaderExample', ctx)).toThrowError()
})

test('validateHeader - paymentDate in correct position', () => {
  const ctx = { index: 0 } as InfoField
  expect(validateHeader('paymentDate', ctx)).toBe('paymentDate')
})

test('validateHeader - paymentDate NOT in correct position', () => {
  const ctx = { index: 1 } as InfoField
  expect(() => validateHeader('paymentDate', ctx)).toThrowError()
})

test('validateHeader - amount in correct position', () => {
  const ctx = { index: 1 } as InfoField
  expect(validateHeader('amount', ctx)).toBe('amount')
})

test('validateHeader - amount NOT in correct position', () => {
  const ctx = { index: 2 } as InfoField
  expect(() => validateHeader('amount', ctx)).toThrowError()
})

test('validateHeader - description in correct position', () => {
  const ctx = { index: 2 } as InfoField
  expect(validateHeader('description', ctx)).toBe('description')
})

test('validateHeader - description NOT in correct position', () => {
  const ctx = { index: 3 } as InfoField
  expect(() => validateHeader('description', ctx)).toThrowError()
})

test('validateHeader - categoryName in correct position', () => {
  const ctx = { index: 3 } as InfoField
  expect(validateHeader('categoryName', ctx)).toBe('categoryName')
})

test('validateHeader - categoryName NOT in correct position', () => {
  const ctx = { index: 0 } as InfoField
  expect(() => validateHeader('categoryName', ctx)).toThrowError()
})

test('validateDateString - valid ISO string', () => {
  const ctx = { index: 0, lines: 1 } as InfoField
  expect(validateDateString('2000-01-01', ctx)).toBe('2000-01-01')
})

test('validateDateString - valid mm/dd/yyyy string', () => {
  const ctx = { index: 0, lines: 1 } as InfoField
  expect(validateDateString('1/1/2000', ctx)).toBe('2000-01-01')
})

test('validateDateString - valid mm/dd/yy string', () => {
  const ctx = { index: 0, lines: 1 } as InfoField
  expect(validateDateString('1/1/00', ctx)).toBe('2000-01-01')
})

test('validateDateString - empty date', () => {
  const ctx = { index: 0, lines: 1 } as InfoField
  expect(() => validateDateString('', ctx)).toThrowError()
})

test('castToCents - valid integer', () => {
  const ctx = { index: 0, lines: 1 } as InfoField
  expect(castToCents('100', ctx)).toBe(10000)
})

test('castToCents - valid float', () => {
  const ctx = { index: 0, lines: 1 } as InfoField
  expect(castToCents('98.72', ctx)).toBe(9872)
})

test('castToCents - valid negative', () => {
  const ctx = { index: 0, lines: 1 } as InfoField
  expect(castToCents('-54.31', ctx)).toBe(-5431)
})

test('castToCents - empty string', () => {
  const ctx = { index: 0, lines: 1 } as InfoField
  expect(() => castToCents('', ctx)).toThrowError()
})

test('castToCents - non-numeric chars', () => {
  const ctx = { index: 0, lines: 1 } as InfoField
  expect(() => castToCents('qwert', ctx)).toThrowError()
})

test('parseCSV - valid output', async () => {

  const filePath = `${process.cwd()}/tests/electron/services/import-test.csv`
  const result = await parseCSV(filePath)

  expect(result.length).toBe(3)

  expect(result[0].paymentDate).toBe('2026-01-01')
  expect(result[0].amount).toBe(1000)
  expect(result[0].description).toBe('Test 1')
  expect(result[0].categoryName).toBe('Shopping')

  expect(result[1].paymentDate).toBe('2026-02-15')
  expect(result[1].amount).toBe(-2000)
  expect(result[1].description).toBe('Test 2')
  expect(result[1].categoryName).toBe('Groceries')

  expect(result[2].paymentDate).toBe('2026-03-31')
  expect(result[2].amount).toBe(3500)
  expect(result[2].description).toBe('Test 3')
  expect(result[2].categoryName).toBe('Entertainment')
})
