import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MERCBEX - Premium Crop Protection Solutions | Pesticides & Agri Products",
  description:
    "MERCBEX is India's trusted destination for premium agricultural pesticides, herbicides, fungicides, and bio-solutions. Government approved, lab tested, and farmer trusted.",
  keywords: "pesticides, herbicides, fungicides, bio-pesticides, crop protection, agriculture, farming, MERCBEX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              {children}
              <CartDrawer />
              <WhatsAppButton />
              <Footer />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
