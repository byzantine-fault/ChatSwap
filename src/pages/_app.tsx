import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Web3Modal } from "@/context/Web3Modal";
import { ThemeProvider } from "styled-components";
import { ThorinGlobalStyles, darkTheme } from "@ensdomains/thorin";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3Modal>
      <ThemeProvider theme={darkTheme}>
        <ThorinGlobalStyles />
        <NextUIProvider>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            <Component {...pageProps} />{" "}
          </NextThemesProvider>
        </NextUIProvider>
      </ThemeProvider>
    </Web3Modal>
  );
}
