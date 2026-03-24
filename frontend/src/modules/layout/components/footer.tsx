"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { siteConfig } from "@/lib/config"

const shopLinks = [
  { href: "/products", label: "All Products" },
  { href: "/products/winepopper-aluminum", label: "Winepopper Aluminum" },
  { href: "/products/winepopper-lite", label: "Winepopper Lite" },
  { href: "/products/refill-gas-capsule", label: "Refill Capsules" },
]

const supportLinks = [
  { href: "/contact", label: "Contact" },
  { href: "/policies/shipping", label: "Shipping Policy" },
  { href: "/policies/returns", label: "Return Policy" },
  { href: "/#faq", label: "FAQ" },
]

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white">
      <div className="container-main py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1 — Brand + Logo */}
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo-winepopper.svg"
                alt="Winepopper"
                width={160}
                height={30}
                className="h-7 w-auto"
              />
            </Link>
            <p className="mt-3 text-sm text-brand-gray-300 font-body">
              {siteConfig.tagline}
            </p>
            <div className="flex gap-4 mt-5">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-brand-gray-300 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-brand-gray-300 hover:text-white transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Col 2 — Shop */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wide mb-4">
              Shop
            </h4>
            <ul className="space-y-2">
              {shopLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-brand-gray-300 hover:text-white transition-colors font-body"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Support */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wide mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              {supportLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-brand-gray-300 hover:text-white transition-colors font-body"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact Info */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wide mb-4">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-brand-red" />
                <span className="text-sm text-brand-gray-300 font-body">
                  {siteConfig.contact.address}
                </span>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center gap-3 text-sm text-brand-gray-300 hover:text-white transition-colors font-body"
                >
                  <Mail className="h-4 w-4 shrink-0 text-brand-red" />
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-sm text-brand-gray-300 hover:text-white transition-colors font-body"
                >
                  <Phone className="h-4 w-4 shrink-0 text-brand-red" />
                  {siteConfig.contact.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-main py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-gray-500 font-body">
          <span>&copy; {new Date().getFullYear()} Winepopper USA. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/policies/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/policies/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
