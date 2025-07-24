import "./globals.css"

export const metadata = {
  title: "HealthChain - Blockchain Health Records",
  description: "Secure health management system powered by ICP blockchain",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
