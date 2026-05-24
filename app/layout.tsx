import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import Navbar from "@/components/navbar";
import Providers from "@/components/Provider";
import ChatWidget from "@/components/ChatWidget";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "民泊マーケティング - 日本全国の民宿・民泊を検索",
  description:
    "日本全国の民泊・民宿を簡単に検索・予約。AI が最適な物件をご提案します。東京、大阪、京都、北海道、沖縄、福岡など、人気エリアの民泊物件を掲載。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "民泊マーケティング",
    title: "民泊マーケティング - 日本全国の民宿・民泊を検索",
    description:
      "日本全国の民泊・民宿を簡単に検索・予約。AI が最適な物件をご提案します。",
  },
  twitter: {
    card: "summary_large_image",
    site: "@minpaku_jp",
    title: "民泊マーケティング - 日本全国の民宿・民泊を検索",
    description:
      "日本全国の民泊・民宿を簡単に検索・予約。",
  },
  alternates: {
    canonical: "https://your-app.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={nunito.className}>
        <Providers>
          <Navbar />
          <main className="pb-16 md:pt-28 pt-24">{children}</main>
          <ChatWidget />
        </Providers>
      </body>
      <GoogleAnalytics gaId={process.env.GA_MEASUREMENT_ID || ""} />
    </html>
  );
}
