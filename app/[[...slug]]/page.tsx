import DropzoneApp from '@/components/dropzone-app'

export default async function CatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params
  const initialPath = slug?.length ? `/${slug.join('/')}` : '/'
  return <DropzoneApp initialPath={initialPath} />
}
