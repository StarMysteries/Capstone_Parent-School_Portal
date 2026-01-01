export function Header() {
  const currentDate = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })

  return (
    <header className="bg-[#d4d433] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="relative h-16 w-16">
            <img
              src="/Logo.png"
              alt="Bayog Elementary National School Logo"
              className="object-contain"
            />
          </div>
          <nav className="flex items-center gap-6">
            <a href="/about" className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors">
              About Us
            </a>
            <a
              href="/announcements"
              className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
            >
              Announcements
            </a>
            <a
              href="/partnership"
              className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
            >
              Partnership & Events
            </a>
            <a href="/learn" className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors">
              Learn about your child
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-gray-900 mr-8">{currentDate}</span>
          <a href="/login" className="text-sm font-bold text-gray-900 hover:text-gray-700 transition-colors">
            Login
          </a>
          <a href="/register" className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors">
            Register
          </a>
        </div>
      </div>
    </header>
  )
}