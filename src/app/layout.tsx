import GlobalLoader from "@/components/common/global-loader";
import Loader from "@/components/common/loader";
import RootProvider from "@/providers/root-provider";
import { Analytics } from "@vercel/analytics/next";
import "lenis/dist/lenis.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tanmay Kumar",
  description: "I’m a software engineer and product builder focused on creating scalable, high-performance systems and developer-first tools. I work across modern web technologies, backend architectures, and AI-driven applications, with a strong interest in system design, automation, and building products from zero to production. I enjoy solving hard engineering problems, experimenting with new ideas, and shipping practical solutions that actually get used",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="msapplication-TileColor" content="#00aba9" />
        <meta name="theme-color" content="#000000" />
        <meta name="google-site-verification" content="C6FQc6M44LTrxZf43lfic7p53w5X_2E4iDsOKekC9D0" /> {/* vercel */}
        <meta name="google-site-verification" content="VmWAWSml4MFTCFtrVErL-2gJdjv48WOk1tSZY3Pk1kA" /> {/* https://tanmaykumarpanda.in/ */}
      </head>
      <body className={`${inter.className}`}>
        <GlobalLoader />
        <RootProvider>
          <Suspense
            fallback={
              <div className="w-full h-screen flex items-center justify-center bg-black">
                <Loader />
              </div>
            }
          >
            {children}
          </Suspense>
        </RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
