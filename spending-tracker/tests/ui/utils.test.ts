import { expect, test } from 'vitest'

import {
  capitalize,
  formatDateYYYYMMDD,
  formatAmount,
  formatSignedAmount,
  getLastMonth,
  getSumOfPaymentsByCategory,
  sortPaymentData
} from '../../src/ui/utils'

test('capitalize - verify format', () => {
  expect(capitalize('test')).toBe('Test')
})

test('formatDateYYYYMMDD - verify format', () => {
  const result = formatDateYYYYMMDD(new Date())
  const parts = result.split('-')

  expect(result.length).toBe(10)
  expect(parts.length).toBe(3)

  expect(parts[0].length).toBe(4)
  expect(parts[1].length).toBe(2)
  expect(parts[2].length).toBe(2)

  expect(typeof Number(parts[0])).toBe('number')
  expect(typeof Number(parts[1])).toBe('number')
  expect(typeof Number(parts[2])).toBe('number')
})

test('formatAmount - test format', () => {
  const result = formatAmount(1234)
  expect(result).toBe('$12.34')
})

test('formatSignedAmount - positive', () => {
  const result = formatSignedAmount(1234)
  expect(result).toBe('+$12.34')
})

test('formatSignedAmount - negative', () => {
  const result = formatSignedAmount(-9876)
  expect(result).toBe('-$98.76')
})

test('getLastMonth - verify format', () => {
  const result = getLastMonth()
  const parts = result.split('-')

  expect(result.length).toBe(7)
  expect(parts.length).toBe(2)

  expect(parts[0].length).toBe(4)
  expect(parts[1].length).toBe(2)

  expect(typeof Number(parts[0])).toBe('number')
  expect(typeof Number(parts[1])).toBe('number')
})

test('getSumOfPaymentsByCategory - check sums', () => {

  const payments: Payment[] = [
    {
      id: 1,
      description: 'test 1',
      category: 'category 1',
      amount: 50,
      date: new Date()
    },
    {
      id: 2,
      description: 'test 2',
      category: 'category 1',
      amount: 75,
      date: new Date()
    },
    {
      id: 3,
      description: 'test 2',
      category: 'category 2',
      amount: 100,
      date: new Date()
    }
  ]

  const result = getSumOfPaymentsByCategory(payments)

  expect(result.length).toBe(2)

  expect(result[0].label).toBe('category 1')
  expect(result[0].value).toBe(125)

  expect(result[1].label).toBe('category 2')
  expect(result[1].value).toBe(100)
})

test('sortPaymentData - check equal', () => {

    const a: Payment = {
      id: 1,
      description: 'test 1',
      category: 'category 1',
      amount: 50,
      date: new Date()
    }

    const b: Payment = {
      id: 2,
      description: 'test 2',
      category: 'category 1',
      amount: 50,
      date: new Date()
    }

  const result = sortPaymentData('amount', 'asc', a, b)
  expect(result).toBe(0)
})

test('sortPaymentData - check asc', () => {

    const a: Payment = {
      id: 1,
      description: 'test 1',
      category: 'category 1',
      amount: 50,
      date: new Date()
    }

    const b: Payment = {
      id: 2,
      description: 'test 2',
      category: 'category 1',
      amount: 75,
      date: new Date()
    }

  const result = sortPaymentData('amount', 'asc', a, b)
  expect(result).toBe(-1)
})

test('sortPaymentData - check desc', () => {

    const a: Payment = {
      id: 1,
      description: 'test 1',
      category: 'category 1',
      amount: 50,
      date: new Date()
    }

    const b: Payment = {
      id: 2,
      description: 'test 2',
      category: 'category 1',
      amount: 75,
      date: new Date()
    }

  const result = sortPaymentData('amount', 'desc', a, b)
  expect(result).toBe(1)
})
