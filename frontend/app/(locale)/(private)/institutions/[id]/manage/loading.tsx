// NADA de "async" aqui e não use hooks (não precisa "use client")
export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-6 w-1/3 bg-muted rounded animate-pulse" />
      <div className="h-24 bg-muted rounded animate-pulse" />
      <div className="h-24 bg-muted rounded animate-pulse" />
    </div>
  )
}
