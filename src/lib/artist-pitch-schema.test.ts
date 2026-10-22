import { describe, it } from 'node:test'
import { strictEqual, deepStrictEqual } from 'node:assert'
import { artistPitchSchema } from './artist-pitch-schema'

const pitch = { name: 'Test Artist', email: 'artist@example.com', artist_project: 'New album', city: 'Philadelphia', neighborhood: 'Fairmount Park' }

describe('artist city pitches', () => {
  it('requires contact name', () => {
    strictEqual(artistPitchSchema.safeParse({ ...pitch, name: '' }).success, false)
  })
  it('requires a valid contact email', () => {
    strictEqual(artistPitchSchema.safeParse({ ...pitch, email: 'invalid' }).success, false)
  })
  it('requires a proposed city', () => {
    strictEqual(artistPitchSchema.safeParse({ ...pitch, city: '' }).success, false)
  })
  it('requires a proposed neighborhood or park', () => {
    strictEqual(artistPitchSchema.safeParse({ ...pitch, neighborhood: '' }).success, false)
  })
  it('accepts contact details and a proposed location without optional details', () => {
    deepStrictEqual(artistPitchSchema.parse(pitch), { ...pitch, timing: '', links: '', message: '', hp: '' })
  })
})