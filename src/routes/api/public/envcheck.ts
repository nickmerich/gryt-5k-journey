import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/api/public/envcheck')({
  server: { handlers: { GET: async () => Response.json({
    hasUrl: !!process.env.SUPABASE_URL,
    hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasViteUrl: !!import.meta.env.VITE_SUPABASE_URL,
  }) } },
})
