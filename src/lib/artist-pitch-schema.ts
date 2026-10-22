import { z } from 'zod'

export const artistPitchSchema = z.object({
  name: z.string().trim().min(2, 'Add your name.').max(100),
  email: z.string().trim().email('Add a valid email.').max(255),
  artist_project: z.string().trim().min(2, 'Add your artist or project name.').max(150),
  city: z.string().trim().min(2, 'Add your proposed city.').max(120),
  neighborhood: z.string().trim().min(2, 'Add a neighborhood or park.').max(200),
  timing: z.string().trim().max(200).optional().default(''),
  links: z.string().trim().max(1000).optional().default(''),
  message: z.string().trim().max(2000).optional().default(''),
  hp: z.string().max(0).optional().default(''),
}).strict()

export type ArtistPitch = z.infer<typeof artistPitchSchema>