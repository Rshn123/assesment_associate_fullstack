import { ConnectButton } from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";
export function WalletConnect() {
  return (
    <div className="flex items-center justify-center">
      {<ConnectButton>Connect Wallet</ConnectButton>}
    </div>
  );
}
