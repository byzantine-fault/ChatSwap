import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import { WagmiConfig } from "wagmi";
import { arbitrum, mainnet } from "viem/chains";

// 1. Get projectId
const projectId = "484ba4de0a4e19e8c1c8d5b289e9631c";

// 2. Create wagmiConfig
const metadata = {
  name: "ChatSwap",
  description: "ChatSwap",
  url: "https://chatswap.vercel.app",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [mainnet, arbitrum];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains });

export function Web3Modal({ children }: any) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
