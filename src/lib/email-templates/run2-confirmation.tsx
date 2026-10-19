import React from 'react'
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  name?: string
  pace?: string
  weekend?: string
}

const PACES: Record<string, string> = {
  'first-5k': 'First 5K',
  casual: 'Easy and social',
  regular: 'Regular runner',
  fast: 'Chasing a time',
}
const WEEKENDS: Record<string, string> = {
  'dec-1': 'Dec 5–6',
  'dec-2': 'Dec 12–13',
  'dec-3': 'Dec 19–20',
  any: 'Any weekend works',
}

const Email = ({ name, pace, weekend }: Props) => {
  const first = (name || 'Runner').trim().split(' ')[0]
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>You're on the Run #02 list. Early December 2026, 11am EST start.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={eyebrow}>GRYT CLUB · RUN #02</Text>
          <Heading as="h1" style={h1}>YOU'RE IN, {first.toUpperCase()}.</Heading>
          <Text style={lead}>
            You're on the Run #02 drop list. We're targeting early December 2026. First word on the
            final date, route, and bibs lands here.
          </Text>
          <Section style={card}>
            <Text style={cardEyebrow}>YOUR PICKS</Text>
            <Row label="Weekend" value={(weekend && WEEKENDS[weekend]) || 'Not set'} />
            <Row label="Pace" value={(pace && PACES[pace]) || 'Not set'} />
            <Row label="Target" value="Early December 2026" />
            <Row label="Start time" value="11am EST" />
          </Section>
          <Text style={body}>
            We'll lock the date based on what the crew votes for. Keep an eye on your inbox.
          </Text>
          <Hr style={hr} />
          <Text style={sign}>DO HARD THINGS TOGETHER</Text>
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
  subject: (d: Record<string, any>) => `You're on the Run #02 list${d?.name ? `, ${String(d.name).split(' ')[0]}` : ''}`,
  displayName: 'Run #02 signup confirmation',
  previewData: { name: 'Nick Merich', pace: 'casual', weekend: 'dec-2' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', color: '#1a1a1a' }
const container = { maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }
const eyebrow = { fontSize: '11px', letterSpacing: '0.18em', fontWeight: 700 as const, color: '#2f4a37', margin: '0 0 20px 0' }
const h1 = { fontSize: '36px', lineHeight: '1.05', fontWeight: 800 as const, color: '#1e3a2a', margin: '0 0 20px 0' }
const lead = { fontSize: '16px', lineHeight: '1.55', color: '#2a2a2a', margin: '0 0 24px 0' }
const card = { backgroundColor: '#f7f2ea', border: '1px solid #e6ddce', padding: '20px 22px', margin: '8px 0 24px 0' }
const cardEyebrow = { fontSize: '10px', letterSpacing: '0.2em', fontWeight: 700 as const, color: '#8a5a3b', margin: '0 0 8px 0' }
const rowLabel = { fontSize: '13px', color: '#6b6b6b', padding: '4px 0', width: '30%' }
const rowValue = { fontSize: '14px', color: '#1a1a1a', fontWeight: 600 as const, padding: '4px 0' }
const hr = { borderColor: '#e6ddce', margin: '14px 0' }
const body = { fontSize: '15px', lineHeight: '1.6', color: '#2a2a2a', margin: '0 0 20px 0' }
const sign = { fontSize: '14px', fontWeight: 700 as const, letterSpacing: '0.14em', color: '#c2492a', margin: 0 }
