import { Button } from "@/components/ui/button"
import { useState } from "react"
import { AboutUsDropdown } from "./AboutUsDropdown"

export const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
          <nav className="flex flex-col md:flex-row items-center gap-4 md:gap-20 text-center md:text-left">
            <div className="relative">
              <a className="text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                About Us
              </a>
              {isDropdownOpen && <AboutUsDropdown />}
            </div>
            <a
              href="/announcements"
              className="text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors"
            >
              Announcements
            </a>
            <a
              href="/partnership"
              className="text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors"
            >
              Partnership & Events
            </a>
            <a href="/learn" className="text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors">
              Learn about your child
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button
            className="h-10 w-32 rounded-full bg-[#4a9d5f] px-12 text-base text-[20px] font-semibold text-white hover:bg-[#3d8550] transition-colors ">
            Login
          </Button>
          <Button
            className="h-10 w-32 rounded-full bg-white px-12 text-base text-[20px] font-semibold text-[#4a9d5f] hover:bg-[#e0e0e0] transition-colors ">
            Register
          </Button>
        </div>
      </div>
    </header>
  )
}