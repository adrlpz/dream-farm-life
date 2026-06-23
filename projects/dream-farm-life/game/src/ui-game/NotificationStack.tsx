// NotificationStack.tsx — Floating notification toasts
interface NotificationStackProps {
  notifications: string[]
}

export function NotificationStack({ notifications }: NotificationStackProps) {
  if (notifications.length === 0) return null

  return (
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 flex flex-col gap-1.5 items-center pointer-events-none z-40">
      {notifications.map((msg, i) => (
        <div
          key={`${msg}-${i}`}
          className="bg-black/70 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full animate-fade-up"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          {msg}
        </div>
      ))}
    </div>
  )
}
