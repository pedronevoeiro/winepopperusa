"use client"

import { useState } from "react"
import { X } from "lucide-react"

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="relative z-50 bg-brand-red text-white text-sm text-center py-2.5 px-10">
      <p className="font-body">
        Free Shipping on Orders Over $50 ✦ Use Code{" "}
        <strong className="underline underline-offset-2">WELCOME10</strong> for 10% Off
      </p>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
        aria-label="Dismiss announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
