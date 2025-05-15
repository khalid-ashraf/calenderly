import type { Metadata } from "next";

import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Calenderly",
  description: "Calenderly - Book your appointments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body
          className={cn(
            "min-h-screen, bg-background, antialiased, inter.variable, geistSans.variable, geistMono.variable"
          )}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

