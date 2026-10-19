import { createServerFn } from '@tanstack/react-start'
import { run3Row, run3Schema } from './run3-schema'

export const joinRun3 = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => run3Schema.parse(input))
  .handler(async ({ data }) => {
    // Public interest form: only validated fields can be inserted; no client reads.
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
    const { sendTemplateEmail } = await import('@/lib/email-templates/send-email')
    const { data: saved, error } = await supabaseAdmin.from('run2_interest')
      .insert(run3Row(data)).select('id').single()
    if (error || !saved) throw new Error('Your signup could not be saved. Please try again.')
    let ownerNotified = false
    try {
      const result = await sendTemplateEmail('owner-signup-alert', 'merichnick@gmail.com', {
        templateData: { source: 'Run #03 · Runner interest', fields: { Name: data.name, Email: data.email, Pace: data.pace, Event: 'Run #03', Status: 'Interest list — date and route unconfirmed' } },
        idempotencyKey: `owner-run3-${saved.id}`,
      })
      ownerNotified = result.sent
    } catch { console.error('Run #03 owner alert could not be sent; signup remains saved.') }
    return { success: true, id: saved.id, ownerNotified }
  })