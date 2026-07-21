import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { CropProvider } from "@/context/CropContext";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
        className={`${dmSans.variable} ${syne.variable} antialiased bg-white text-gray-900`}
      >
        <LanguageProvider>
          <AuthProvider>
            <CropProvider>
              <CartProvider>
                <Navbar />
                {children}
                <CartDrawer />
                <WhatsAppButton />
                <Footer />
              </CartProvider>
            </CropProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
