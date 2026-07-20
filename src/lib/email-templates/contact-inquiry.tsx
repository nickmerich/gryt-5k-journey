import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  name?: string
  email?: string
  subject?: string
  message?: string
  submittedAt?: string
}

const Email = ({ name, email, subject, message, submittedAt }: Props) => {
  const displayName = name || 'Someone'
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>New contact form message from {displayName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={eyebrowSection}>
            <Text style={eyebrow}>GRYT CLUB · CONTACT FORM</Text>
          </Section>

          <Heading as="h1" style={h1}>
            NEW MESSAGE
          </Heading>

          <Text style={lead}>
            A visitor sent a message through the Run Takoma With Love contact
            form.
          </Text>

          <Section style={card}>
            <Row label="From" value={displayName} />
            <Row label="Email" value={email ?? '—'} />
            <Row label="Subject" value={subject ?? '(no subject)'} />
            {submittedAt ? <Row label="Sent" value={submittedAt} /> : null}
          </Section>

          <Text style={bodyLabel}>MESSAGE</Text>
          <Text style={bodyText}>{message ?? ''}</Text>

          <Hr style={hr} />

          <Text style={signSmall}>
            Reply directly to {email ?? 'the sender'} to respond.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <table style={{ width: '100%', borderCollapse: 'collapse', margin: '6px 0' }}>
    <tbody>
      <tr>
        <td style={rowLabel}>{label}</td>
        <td style={rowValue}>{value}</td>
      </tr>
    </tbody>
  </table>
)

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `[Contact] ${data?.subject || 'New message'}${data?.name ? ` — ${data.name}` : ''}`,
  displayName: 'RTWL Contact Form Notification',
  to: 'hello@grytrun.com',
  previewData: {
    name: 'Jordan Rivera',
    email: 'jordan@example.com',
    subject: 'Volunteering on race day',
    message: 'Hi! I would love to help at the water station.',
    submittedAt: 'July 20, 2026 · 10:32 AM ET',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  color: '#1a1a1a',
}
const container = { maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }
const eyebrowSection = { marginBottom: '20px' }
const eyebrow = {
  fontSize: '11px',
  letterSpacing: '0.18em',
  fontWeight: 700 as const,
  color: '#2f4a37',
  margin: 0,
}
const h1 = {
  fontSize: '32px',
  lineHeight: '1.05',
  letterSpacing: '-0.01em',
  fontWeight: 800 as const,
  color: '#1e3a2a',
  margin: '0 0 16px 0',
  textTransform: 'uppercase' as const,
}
const lead = {
  fontSize: '15px',
  lineHeight: '1.55',
  color: '#2a2a2a',
  margin: '0 0 20px 0',
}
const card = {
  backgroundColor: '#f7f2ea',
  border: '1px solid #e6ddce',
  padding: '16px 20px',
  margin: '0 0 20px 0',
}
const rowLabel = {
  fontSize: '12px',
  color: '#6b6b6b',
  padding: '4px 0',
  width: '30%',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
}
const rowValue = {
  fontSize: '14px',
  color: '#1a1a1a',
  fontWeight: 600 as const,
  padding: '4px 0',
}
const bodyLabel = {
  fontSize: '11px',
  letterSpacing: '0.18em',
  fontWeight: 700 as const,
  color: '#8a5a3b',
  margin: '0 0 6px 0',
}
const bodyText = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#1a1a1a',
  whiteSpace: 'pre-wrap' as const,
  margin: '0 0 20px 0',
}
const hr = { borderColor: '#e6ddce', margin: '14px 0' }
const signSmall = { fontSize: '12px', color: '#8a8a8a', margin: 0 }
