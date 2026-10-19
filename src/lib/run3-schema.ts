import { z } from 'zod'

export const RUN3_EVENT_CODE = 'run-03'
export const run3Schema = z.object({
  name: z.string().trim().min(2, 'Enter your full name.').max(100),
  email: z.string().trim().email('Enter a valid email address.').max(255),
  pace: z.enum(['first-5k', 'casual', 'regular', 'fast'], { errorMap: () => ({ message: 'Choose your pace.' }) }),
  website: z.string().max(0).optional().default(''),
}).strict()

export function run3Row(data: z.infer<typeof run3Schema>) {
  return { kind: 'runner', event_code: RUN3_EVENT_CODE, name: data.name, email: data.email.toLowerCase(), pace: data.pace }
}