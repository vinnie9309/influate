import "./globals.css"

export const metadata = {
  title: "shortmemory.com",
  description: "where you keep your short memory"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
