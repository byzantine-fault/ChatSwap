import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { WagmiConfig, configureChains, createConfig, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

export default function App({ Component, pageProps }: AppProps) {
  const { publicClient, chains } = configureChains(
    [mainnet],
    [publicProvider()]
  );

  const config = createConfig(
    getDefaultConfig({
      walletConnectProjectId: "484ba4de0a4e19e8c1c8d5b289e9631c",
      appName: "ChatSwap",
      chains,
      publicClient,
    })
  );

  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider theme="midnight">
        <NextUIProvider>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            <Component {...pageProps} />{" "}
          </NextThemesProvider>
        </NextUIProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
