import { useEffect, useState, type ChangeEvent } from "react";
import {
  useCurrentWallet,
  useCurrentAccount,
  useDisconnectWallet,
  useSuiClient,
  useSuiClientContext,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { CustomButton } from "../components/CustomButton";
import useTransferSUI from "./transfer";
import { useToast } from "../hooks/ToastHook";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Header } from "../sections/Headers";
import { AccountInfo } from "../sections/Accounts";
import { SendSUI } from "../sections/SendUI";
import { MintNFT } from "../sections/MintNFT";

export function Home() {
  //For using SUI sdk
  const client = useSuiClient();
  const currentWallet = useCurrentWallet();
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const { transferSUI } = useTransferSUI();
  const { network } = useSuiClientContext();
  const { showToast, ToastContainer } = useToast();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();

  //For preserving states
  const [recipient, setRecipient] = useState("");
  const [digest, setDigest] = useState("");
  const [mintDigest, setMintDigest] = useState("");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState<string>("0");
  const [invalidAddressError, setInvalidAddressError] = useState("");
  const [invalidAmountError, setInvalidAmountError] = useState("");
  const [transcation, setTransactions] = useState<any[]>([]);

  // Fetch balance periodically
  useEffect(() => {
    if (!currentAccount) return;
    async function fetchBalance() {
      try {
        const res = await client.getBalance({
          owner: currentAccount!.address,
          coinType: "0x2::sui::SUI",
        });
        setBalance((Number(res.totalBalance) / 1e9).toFixed(3));
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    }
    fetchBalance();
  }, [client, currentAccount, network]);

  // Validation
  const validateAddress = (value: string): boolean => {
    const isValid = /^0x[a-fA-F0-9]{64}$/.test(value.trim());
    setInvalidAddressError(
      isValid || value === "" ? "" : "Invalid wallet address"
    );
    return isValid;
  };

  const validateAmount = (value: number): boolean => {
    const isValid = value > 0;
    setInvalidAmountError(isValid ? "" : "Amount must be greater than 0");
    return isValid;
  };

  // Inputs
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    validateAmount(Number(value));
  };

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRecipient(value);
    validateAddress(value);
  };

  // Transaction history
  useEffect(() => {
    const client = new SuiClient({ url: getFullnodeUrl("testnet") });
    const queryTransaction = async (address: string) => {
      const result = await client.queryTransactionBlocks({
        filter: { FromAddress: address },
        limit: 100,
        order: "descending",
      });
      setTransactions(result.data);
    };
    const address = currentAccount?.address;
    if (address) queryTransaction(address);
  }, [currentAccount?.address]);

  // Mint NFT
  const handleMintNft = async () => {
    const tx = new Transaction();
    tx.moveCall({
      target:
        "0x5ea6aafe995ce6506f07335a40942024106a57f6311cb341239abf2c3ac7b82f::nft::mint",
      arguments: [
        tx.pure.string("NFT"),
        tx.pure.string("Sample NFT"),
        tx.pure.string(
          "https://xc6fbqjny4wfkgukliockypoutzhcqwjmlw2gigombpp2ynufaxa.arweave.net/uLxQwS3HLFUailocJWHupPJxQsli7aMgzmBe_WG0KC4"
        ),
      ],
    });
    const result = await signAndExecuteTransaction({
      transaction: tx,
      chain: "sui:testnet",
    });
    setMintDigest(result.digest);
  };

  // Transfer
  const handleTransfer = async () => {
    if (!validateAddress(recipient) || !validateAmount(Number(amount))) return;
    try {
      const mistAmount = BigInt(Number(amount) * 10 ** 9);
      setLoading(true);
      const result = await transferSUI(recipient, mistAmount);
      setLoading(false);
      setDigest(result.digest);
      setTransactions([{ digest: result.digest }, ...transcation]);
      showToast("Transaction successful.", "success");
      setAmount("");
      setRecipient("");
    } catch (err) {
      console.error("Transfer failed:", err);
    }
  };

  const handleDisconnectClick = () => disconnect();

  const isConnected = currentWallet.connectionStatus === "connected";

  return (
    <div className="w-screen h-screen bg-[#0b0e11] text-gray-100 flex flex-col items-center justify-center">
      <div className="w-screen h-screen bg-[#111418] rounded-2xl shadow-xl p-6 relative">
        <Header
          isConnected={isConnected}
          onDisconnect={handleDisconnectClick}
        />
        {isConnected ? (
          <main>
            <AccountInfo
              network={network}
              currentAccount={currentAccount}
              balance={balance}
              transcation={transcation}
            />
            <div className="flex mt-2">
              <SendSUI
                recipient={recipient}
                amount={amount}
                invalidAddressError={invalidAddressError}
                invalidAmountError={invalidAmountError}
                handleAddressChange={handleAddressChange}
                handleAmountChange={handleAmountChange}
                handleTransfer={handleTransfer}
                loading={loading}
                digest={digest}
              />
              <MintNFT
                handleMintNft={handleMintNft}
                mintDigest={mintDigest}
                loading={loading}
              />
            </div>
          </main>
        ) : (
          <div className="mt-20 text-center">
            <CustomButton
              text="View Docs"
              onClick={() =>
                window.open("https://kit.suiet.app/docs/QuickStart/")
              }
              buttonStyle="bg-[#e5e7ec] text-black w-52 hover:bg-gray-400 outline-none"
            />
            <img
              src="https://kit.suiet.app/img/trustedby.png"
              className="w-[1200px] mt-10 mx-auto"
              alt="trusted partners"
            />
          </div>
        )}
      </div>
      {ToastContainer}
    </div>
  );
}
