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
  ticket?: '5k' | 'walker' | 'supporter' | string
  waiverAccepted?: boolean
}

const TICKET_LABELS: Record<string, string> = {
  '5k': '5K Runner',
  walker: 'Walker',
  supporter: 'Supporter',
}

const Email = ({ name, ticket, waiverAccepted }: Props) => {
  const displayName = name || 'Runner'
  const ticketLabel = ticket ? TICKET_LABELS[ticket] ?? ticket : 'Registered'
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>You're in — Run Takoma With Love 5K, Sunday Aug 2, 2026</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={eyebrowSection}>
            <Text style={eyebrow}>GRYT CLUB · 5K SERIES</Text>
          </Section>

          <Heading as="h1" style={h1}>
            YOU'RE IN,<br />
            {displayName.toUpperCase()}.
          </Heading>

          <Text style={lead}>
            Thanks for signing up for <strong>Run Takoma With Love 5K</strong>.
            Save the date and lace up — we'll see you at the start line.
          </Text>

          <Section style={ticketCard}>
            <Text style={ticketEyebrow}>YOUR TICKET</Text>
            <Text style={ticketType}>{ticketLabel}</Text>
            <Hr style={hr} />
            <Row label="Date" value="Sunday, August 2, 2026" />
            <Row label="Start" value="9:00 AM" />
            <Row label="Where" value="Takoma Park, Maryland" />
            <Row
              label="Waiver"
              value={waiverAccepted ? 'Accepted ✓' : 'Not on file'}
            />
          </Section>

          <Text style={body}>
            Bring water, wear something you can move in, and get there 15
            minutes early for check-in. Full route details, packet pickup, and
            day-of updates land in your inbox the week of the run.
          </Text>

          <Hr style={hr} />

          <Text style={sign}>Community. Movement. Takoma.</Text>
          <Text style={signSmall}>
            Presented by GRYT Club · In partnership with smartwater, Heno.,
            and Oddisee
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
    `You're in — Run Takoma With Love 5K${data?.name ? `, ${data.name}` : ''}`,
  displayName: 'RTWL 5K Registration Confirmation',
  previewData: {
    name: 'Jordan Rivera',
    ticket: '5k',
    waiverAccepted: true,
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  color: '#1a1a1a',
}
const container = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '32px 24px',
}
const eyebrowSection = { marginBottom: '20px' }
const eyebrow = {
  fontSize: '11px',
  letterSpacing: '0.18em',
  fontWeight: 700 as const,
  color: '#2f4a37',
  margin: 0,
}
const h1 = {
  fontSize: '38px',
  lineHeight: '1.05',
  letterSpacing: '-0.01em',
  fontWeight: 800 as const,
  color: '#1e3a2a',
  margin: '0 0 20px 0',
  textTransform: 'uppercase' as const,
}
const lead = {
  fontSize: '16px',
  lineHeight: '1.55',
  color: '#2a2a2a',
  margin: '0 0 24px 0',
}
const ticketCard = {
  backgroundColor: '#f7f2ea',
  border: '1px solid #e6ddce',
  padding: '20px 22px',
  margin: '8px 0 24px 0',
}
const ticketEyebrow = {
  fontSize: '10px',
  letterSpacing: '0.2em',
  fontWeight: 700 as const,
  color: '#8a5a3b',
  margin: '0 0 4px 0',
}
const ticketType = {
  fontSize: '22px',
  fontWeight: 800 as const,
  color: '#c2492a',
  margin: '0 0 12px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.02em',
}
const rowLabel = {
  fontSize: '13px',
  color: '#6b6b6b',
  padding: '4px 0',
  width: '30%',
}
const rowValue = {
  fontSize: '14px',
  color: '#1a1a1a',
  fontWeight: 600 as const,
  padding: '4px 0',
}
const hr = { borderColor: '#e6ddce', margin: '14px 0' }
const body = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#2a2a2a',
  margin: '0 0 20px 0',
}
const sign = {
  fontSize: '14px',
  fontWeight: 700 as const,
  letterSpacing: '0.14em',
  color: '#c2492a',
  textTransform: 'uppercase' as const,
  margin: '0 0 6px 0',
}
const signSmall = {
  fontSize: '12px',
  color: '#8a8a8a',
  margin: 0,
}
