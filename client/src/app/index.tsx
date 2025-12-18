import { ThemeToogle } from '@/components/theme-toggle'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-2">
      <h1>Welcome Home!</h1>
      <ThemeToogle />
    </div>
  )
}