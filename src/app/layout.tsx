import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  icons: {
    icon: "/metalogo.png",
    shortcut: "/metalogo.png",
    apple: "/metalogo.png",
  },
  title: {
    default: "META Contest — India's Open Online Quiz Competition 2026",
    template: "%s | META Contest",
  },
  description:
    "Participate in META Contest on June 6, 2026 at 1:00 PM. 50 MCQ questions covering GK, Tech, Aptitude & Current Affairs. Win up to ₹5,000. Open for all. Entry fee just ₹50.",
  keywords: [
    "META Contest",
    "online quiz competition India 2026",
    "student contest",
    "GK quiz",
    "win cash prize",
    "metacontest.me",
    "online exam India",
    "quiz competition 2026",
  ],
  metadataBase: new URL("https://metacontest.me"),
  openGraph: {
    title: "META Contest 2026 — Win ₹10,000 Prize Pool",
    description:
      "India's most open online contest. Appear on June 6, 2026 at 1:00 PM. Win prizes, earn your certificate. Open for everyone.",
    url: "https://metacontest.me",
    siteName: "META Contest",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "META Contest 2026" }],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "META Contest 2026 — India's Open Online Quiz",
    description:
      "Join India's open online quiz on June 6, 2026 at 1:00 PM. Win up to ₹5,000. Entry fee: ₹50.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://metacontest.me",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmSerifDisplay.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
