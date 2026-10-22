import { describe, expect, it } from 'vitest'
import { artistPitchSchema } from './artist-pitch-schema'

const pitch = { name: 'Test Artist', email: 'artist@example.com', artist_project: 'New album', city: 'Philadelphia', neighborhood: 'Fairmount Park' }

describe('artist city pitches', () => {
  it('requires contact name', () => {
    expect(artistPitchSchema.safeParse({ ...pitch, name: '' }).success).toBe(false)
  })
  it('requires a valid contact email', () => {
    expect(artistPitchSchema.safeParse({ ...pitch, email: 'invalid' }).success).toBe(false)
  })
  it('requires a proposed city', () => {
    expect(artistPitchSchema.safeParse({ ...pitch, city: '' }).success).toBe(false)
  })
  it('requires a proposed neighborhood or park', () => {
    expect(artistPitchSchema.safeParse({ ...pitch, neighborhood: '' }).success).toBe(false)
  })
  it('accepts contact details and a proposed location without optional details', () => {
    expect(artistPitchSchema.parse(pitch)).toMatchObject(pitch)
  })
})