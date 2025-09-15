import { expect, test } from 'vitest'

import { validateHeader } from './importer.js'

import type { CastingContext } from 'csv-parse'

test('validateHeader - paymentDate in correct position', () => {
  const ctx = { index: 0 }
  expect(validateHeader('paymentDate', ctx as CastingContext)).toBe('paymentDate')
})
