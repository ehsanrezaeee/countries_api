import { Metadata } from "next";

// react query Provider
import Providers from "./providers";

import "./globals.css";

import { ThemeProvider } from "@/components/general/theme-provider";

type Props = {
  readonly children: React.ReactNode;
};

export const metadata: Metadata = {
  title: "Ehsan Advanced Api",
  description: "Countries Seach and regions",
  icons: [
    {
      url: "/images/favicon.ico",
      href: "/images/favicon.ico",
    },
  ],
};

export default function Layout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
