import { CustomButton } from "../components/CustomButton";
import {
  useCurrentWallet,
  useCurrentAccount,
  useDisconnectWallet,
  useSuiClient,
} from "@mysten/dapp-kit";
import { WalletConnect } from "../components/WalletConnect";
import { useEffect, useState, type ChangeEvent } from "react";
import useTransferSUI from "./transfer";

export function Home() {
  const client = useSuiClient();
  const [balance, setBalance] = useState<string>("0");

  // Extract transferSUI function from the custom hook
  const { transferSUI } = useTransferSUI();
  // State for input fields
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  // const [digest, setDigest] = useState("");
  const [, setShowModal] = useState(false);
  const { mutate: disconnect } = useDisconnectWallet();

  // Handle "Send SUI" button click
  const handleTransfer = async () => {
    const mistAmount = BigInt(amount);
    const result = await transferSUI(recipient, mistAmount);
    console.log(result);
    // setDigest(result.digest);
  };
  // Access wallet connection info and actions
  const currentWallet = useCurrentWallet();
  const currentAccount = useCurrentAccount();

  // For saving state
  // const [, setCopied] = useState(false);

  // Address error
  const [invalidAddressError, setInvalidAddressError] = useState("");

  // Amount error
  const [invalidAmountError, setInvalidAmountError] = useState("");

  // For copying address
  // const copyToClipboard = async () => {
  //   try {
  //     await navigator.clipboard.writeText(currentAccount!.address!);
  //     setCopied(true);
  //     setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  //   } catch (err) {
  //     console.error("Failed to copy!", err);
  //   }
  // };

  useEffect(() => {
    if (!currentAccount) return;

    async function fetchBalance() {
      try {
        const response = await client.getBalance({
          owner: currentAccount!.address,
          coinType: "0x2::sui::SUI",
        });
        setBalance((Number(response.totalBalance) / 1e9).toFixed(3));
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    }

    fetchBalance();
    const interval = setInterval(fetchBalance, 8000);
    return () => clearInterval(interval);
  }, [currentAccount, client]);

  // Validate a SUI-style (or Ethereum-like) address
  const validateAddress = (value: string): boolean => {
    // Example: 0x followed by 64 hex chars (SUI)
    const isValid = /^0x[a-fA-F0-9]{64}$/.test(value.trim());
    setInvalidAddressError(
      isValid || value === "" ? "" : "Invalid wallet address"
    );
    return isValid;
  };

  // Validate amount
  const validateAmount = (value: number): boolean => {
    const isValid = value >= 0;
    setInvalidAmountError(isValid ? "" : "Insert value greater than 0");
    return isValid;
  };

  // Handle amount change
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setAmount(value);
    validateAmount(Number(value));
  };

  // // For handling connect button click
  // const handleConnectClick = () => setShowModal(true);

  //For handling disconnect button click
  const handleDisconnectClick = () => {
    disconnect();
    setShowModal(false);
  };

  //For handling address change
  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setRecipient(value);
    validateAddress(value);
  };

  return (
    <div className="w-screen h-screen bg-[#0b0e11] text-gray-100 flex flex-col items-center justify-center">
      <div className="w-screen h-screen bg-[#111418] rounded-2xl shadow-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg p-2">
              <span className="font-bold text-white">SUI</span>
            </div>
            <h1 className="text-xl font-semibold">SUI Wallet</h1>
          </div>

          <div className="flex gap-6 text-sm text-gray-400">
            <span className="hover:text-white cursor-pointer">Login</span>
            <span className="hover:text-white cursor-pointer">Docs</span>
            <span className="hover:text-white cursor-pointer">Discover</span>
            <span className="hover:text-white cursor-pointer">About</span>
          </div>

          <div className="flex items-center gap-3">
            <div>
              {!(currentWallet.connectionStatus === "connected") ? (
                <WalletConnect />
              ) : (
                <button
                  onClick={handleDisconnectClick}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Disconnect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
        {currentWallet.connectionStatus === "connected" ? (
          <div>
            {/* Main content grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left panel */}
              <div className="bg-[#161b20] rounded-xl p-4 flex flex-col justify-between">
                <h2 className="text-lg mb-3">Send to:</h2>
                <span className="">Address:</span>
                <input
                  type="text"
                  placeholder="Type address..."
                  value={recipient}
                  onChange={handleAddressChange}
                  className="w-full bg-[#1b1f25] border border-gray-700 rounded-lg p-2 text-sm  text-gray-300"
                />
                {invalidAddressError && (
                  <p className="text-red-500 text-xs mt-1">
                    {invalidAddressError}
                  </p>
                )}

                <span>Amount:</span>
                <input
                  type="text"
                  placeholder="Type amount..."
                  value={amount}
                  onChange={handleAmountChange}
                  className="w-full bg-[#1b1f25] border border-gray-700 rounded-lg p-2 text-sm text-gray-300"
                />

                {invalidAmountError && (
                  <p className="text-red-500 text-xs mt-1">
                    {invalidAmountError}
                  </p>
                )}

                <div className="flex justify-between mb-3">
                  <span>1 SUI</span>
                  <span>$3.48</span>
                </div>
                <button
                  onClick={handleTransfer}
                  className="bg-green-600 hover:bg-green-700 rounded-lg py-2 text-sm font-semibold text-white"
                >
                  Send Transaction
                </button>
              </div>

              {/* Chart area */}
              <div className="md:col-span-2 bg-[#161b20] rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg">Account Information</h2>
                  <div className="flex gap-2 text-sm text-gray-400">
                    <label className="text-blue-600">Network:</label>
                    {currentAccount?.chains}
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-2 bg-[#1b1f25] rounded-lg h-48 p-4 text-gray-400 text-sm">
                    <p className="mb-2">
                      <span className="text-white font-semibold">Address:</span>
                    </p>
                    <p className="break-all text-gray-10">
                      {currentAccount!.address}
                    </p>
                  </div>

                  {/* Balance Card */}
                  <div className="flex-1 ml-4 bg-[#1b1f25] rounded-lg h-48 p-4 text-gray-400 text-sm">
                    <p>
                      <span className="text-white font-semibold">Balance:</span>
                    </p>
                    <p className="text-gray-300 text-lg font-medium">
                      {`${balance} SUI`}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm text-gray-400 mb-2">Recent Trades</h3>
                  <div className="bg-[#1b1f25] rounded-lg p-3 text-xs text-gray-300">
                    <div className="grid grid-cols-4 gap-2 mb-2 text-gray-500">
                      <span>Account</span>
                      <span>In</span>
                      <span>Out</span>
                      <span>Age</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <span>0x71...f3d</span>
                      <span>2 ETH</span>
                      <span>0.034 BTC</span>
                      <span>14d ago</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <span>0x92...bd4</span>
                      <span>5 UNI</span>
                      <span>120 DOGE</span>
                      <span>18d ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className=" mt-20">
            <div className="flex justify-center">
              <CustomButton
                text={"View Docs"}
                onClick={() => {
                  window.open("https://kit.suiet.app/docs/QuickStart/");
                }}
                buttonStyle={
                  "bg-[#e5e7ec] text-black w-52 hover:bg-gray-400 outline-none focus:outline-none"
                }
              />
            </div>
            <img
              src="https://kit.suiet.app/img/trustedby.png"
              className="w-[1200px] mt-10 mx-auto"
              alt=""
            />
          </div>
        )}

        {/* Footer */}
        <footer className="absolute bottom-0 left-0 w-full text-xs text-gray-500 text-center border-t border-gray-800 bg-[#111418] py-4">
          © 2024 SUIWallet.io — Affiliate • Regulations • Terms • Docs •
          Contacts
        </footer>
      </div>
    </div>
  );
}
