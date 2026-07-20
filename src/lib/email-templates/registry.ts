import type { ComponentType } from 'react'
import { template as rtwlConfirmation } from './rtwl-confirmation'
import { template as contactInquiry } from './contact-inquiry'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'rtwl-confirmation': rtwlConfirmation,
  'contact-inquiry': contactInquiry,
}
