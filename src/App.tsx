// App.tsx
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { getFullnodeUrl } from "@mysten/sui/client";
import { Home } from "./pages/Home";
import { useState } from "react";

const { networkConfig } = createNetworkConfig({
  mainnet: { url: getFullnodeUrl("mainnet") },
  testnet: { url: getFullnodeUrl("testnet") },
  devnet: { url: getFullnodeUrl("devnet") },
});

const queryClient = new QueryClient();

function App() {
  const [activeNetwork, setActiveNetwork] =
    useState<keyof typeof networkConfig>("testnet");

  return (
    <QueryClientProvider client={queryClient}>
      {/* Network change is not working as mentioned in docs. https://sdk.mystenlabs.com/dapp-kit/sui-client-provider */}
      <SuiClientProvider
        networks={networkConfig}
        network={activeNetwork}
        onNetworkChange={(network: keyof typeof networkConfig) => {
          console.log(network);
          setActiveNetwork(network);
        }}
      >
        <WalletProvider autoConnect>
          <Home />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;
