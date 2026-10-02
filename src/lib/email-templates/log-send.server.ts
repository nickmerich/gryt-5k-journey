import type { SupabaseClient } from '@supabase/supabase-js'
import { sendTemplateEmail } from './send-email'

/**
 * Sends a registered template and records the outcome in the send log.
 * Returns true when the email was sent.
 */
export async function sendAndLog(
  supabase: SupabaseClient,
  templateName: string,
  recipient: string,
  templateData: Record<string, any>,
  idempotencyKey: string,
): Promise<{ sent: boolean; suppressed?: boolean }> {
  const log = async (status: 'sent' | 'suppressed' | 'failed', error_message?: string) => {
    const { error } = await supabase.from('email_send_log').insert({
      message_id: null,
      template_name: templateName,
      recipient_email: recipient,
      status,
      error_message: error_message ?? null,
    })
    if (error) console.error('Failed to write email_send_log', { code: error.code, message: error.message })
  }
  try {
    const r = await sendTemplateEmail(templateName, recipient, { templateData, idempotencyKey })
    if (r.sent) {
      await log('sent')
      return { sent: true }
    }
    await log('suppressed')
    return { sent: false, suppressed: true }
  } catch (e) {
    await log('failed', (e instanceof Error ? e.message : String(e)).slice(0, 1000))
    return { sent: false }
  }
}
