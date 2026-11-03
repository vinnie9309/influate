import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import Providers from "./providers"
import SiteHeader from "@/components/SiteHeader"

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" })

export const metadata: Metadata = {
  title: "Influate — partnerships for growing creators and brands",
  description:
    "Creators get discovered by brands in their niche. Brands find the right voices, connect, and track what every affiliate code earns."
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans">
        <Providers>
          <SiteHeader />
          {children}
        </Providers>
      </body>
    </html>
  )
}
