import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LockerMaster",
  description: "Aplikacja do zarządzania szafkami szkolnymi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`flex flex-col items-center justify-center antialiased min-h-screen h-full`}>
        {children}
      </body>
    </html>
  );
}
