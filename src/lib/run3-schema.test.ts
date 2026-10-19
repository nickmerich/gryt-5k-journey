import { describe, expect, test } from 'bun:test'
import { run3Row, run3Schema } from './run3-schema'

describe('Run #03 signup', () => {
  test('saves to the shared list with a separate Run #03 identifier', () => {
    const data = run3Schema.parse({ name: 'Nick Merich', email: 'Nick@example.com', pace: 'casual' })
    expect(run3Row(data)).toEqual({ kind: 'runner', event_code: 'run-03', name: 'Nick Merich', email: 'nick@example.com', pace: 'casual' })
  })
  test('rejects missing name, invalid email, and missing pace', () => {
    for (const change of [{ name: '' }, { email: 'invalid' }, { pace: '' }]) {
      expect(run3Schema.safeParse({ name: 'Nick Merich', email: 'nick@example.com', pace: 'casual', ...change }).success).toBe(false)
    }
  })
  test('rejects automated honeypot entries and caller-selected events', () => {
    expect(run3Schema.safeParse({ name: 'Nick Merich', email: 'nick@example.com', pace: 'casual', website: 'spam' }).success).toBe(false)
    expect(run3Schema.safeParse({ name: 'Nick Merich', email: 'nick@example.com', pace: 'casual', event_code: 'run-02' }).success).toBe(false)
  })
})