import type { Metadata } from "next";
import "./globals.css";
import { PostHogProvider, PostHogPageview } from "./providers/posthog";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "ClauseScan - Freelance Contract Review",
  description: "Identify risks in your freelance contracts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <PostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageview />
          </Suspense>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
