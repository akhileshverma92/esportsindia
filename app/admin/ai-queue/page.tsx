import { getAiJobs } from '@/lib/queries'
import { AiQueueClient } from '@/components/admin/ai-queue-client'

export default async function AiQueuePage() {
  let jobs: Awaited<ReturnType<typeof getAiJobs>> = []
  let error: string | null = null
  try {
    jobs = await getAiJobs()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load AI queue'
  }

  return (
    <div>
      {error && (
        <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">{error}</div>
      )}
      <AiQueueClient initialJobs={jobs} />
    </div>
  )
}
