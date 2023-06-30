import type { AppProps } from "next/app";
import Web3Provider from "@/providers/Web3";
import { SEO } from "@/components/layout";

import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <Web3Provider>
        <SEO />
        <Component {...pageProps} />
      </Web3Provider>
    </ThemeProvider>
  );
}
