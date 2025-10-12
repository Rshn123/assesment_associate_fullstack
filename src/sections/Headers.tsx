import { WalletConnect } from "../components/WalletConnect";

interface HeaderProps {
  isConnected: boolean;
  onDisconnect: () => void;
}

export function Header({ isConnected, onDisconnect }: HeaderProps) {
  return (
    <header className="flex justify-between items-center border-b border-gray-800 pb-4 mb-4">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 rounded-lg p-2">
          <span className="font-bold text-white">SUI</span>
        </div>
        <h1 className="text-xl font-semibold">SUI Wallet</h1>
      </div>

      <nav className="flex gap-6 text-sm text-gray-400">
        {["Login", "Docs", "Discover", "About"].map((item) => (
          <span key={item} className="hover:text-white cursor-pointer">
            {item}
          </span>
        ))}
      </nav>

      <div>
        {!isConnected ? (
          <WalletConnect />
        ) : (
          <button
            onClick={onDisconnect}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Disconnect
          </button>
        )}
      </div>
    </header>
  );
}
