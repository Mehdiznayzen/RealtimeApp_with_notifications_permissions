import "./globals.css"
import { Roboto_Slab as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import Provider from "@/app/Provider"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata : Metadata = {
  title : "LiveDocs",
  description : "Your go -to collaborative documentation editor ."
}

export default function RootLayout({ children }: { children : React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme : dark,
        variables : {
          colorPrimary : "#3371ff",
          fontSize : "14px"
        }
      }}
    >
      <html 
        lang="en" 
        suppressHydrationWarning
      >
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <Provider>
            {children}
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  )
}
