import React from 'react'
import { Body, Container, Head, Heading, Html, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  source?: string
  fields?: Record<string, string>
}

const Email = ({ source, fields = {} }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New signup: {fields.Name ?? 'someone'} ({source ?? 'site'})</Preview>
    <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', color: '#1a1a1a' }}>
      <Container style={{ maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }}>
        <Text style={{ fontSize: '11px', letterSpacing: '0.18em', fontWeight: 700, color: '#2f4a37' }}>
          GRYT CLUB · NEW SIGNUP
        </Text>
        <Heading as="h1" style={{ fontSize: '26px', color: '#1e3a2a', margin: '0 0 16px' }}>
          {source ?? 'New signup'}
        </Heading>
        {Object.entries(fields).map(([k, v]) => (
          <Text key={k} style={{ fontSize: '14px', margin: '4px 0' }}>
            <strong>{k}:</strong> {v || '—'}
          </Text>
        ))}
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) =>
    `New signup · ${d?.source ?? 'grytrun.com'} · ${d?.fields?.Name ?? ''}`.trim(),
  displayName: 'Owner signup alert',
  to: 'merichnick@gmail.com',
  previewData: { source: 'Run #02 · Runner', fields: { Name: 'Nick Merich', Email: 'nick@example.com', Pace: 'casual' } },
} satisfies TemplateEntry
