import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Pokédex",
  description: "Pokédex hecha con Next.js y la PokéAPI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f5f5f5]">
        <main className="flex-1 w-full max-w-[480px] mx-auto bg-white shadow-[0_0_24px_rgba(0,0,0,0.08)]">
          {children}
        </main>
      </body>
    </html>
  );
}
