import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Web3Modal } from "@/context/Web3Modal";
import { ThemeProvider } from "styled-components";
import { ThorinGlobalStyles, darkTheme } from "@ensdomains/thorin";
import { ChakraProvider } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <>
      {mounted && (
        <Web3Modal>
          <ThemeProvider theme={darkTheme}>
            <ThorinGlobalStyles />
            <ChakraProvider>
              <NextUIProvider>
                <NextThemesProvider attribute="class" defaultTheme="dark">
                  <Component {...pageProps} />{" "}
                </NextThemesProvider>
              </NextUIProvider>
            </ChakraProvider>
          </ThemeProvider>
        </Web3Modal>
      )}
    </>
  );
}
