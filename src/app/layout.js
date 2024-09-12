import "./globals.css"

export const metadata = {
  title: "influate.bg",
  description: "meet, offer, collab"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
