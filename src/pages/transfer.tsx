import {
  useCurrentWallet,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

function useTransferSUI() {
  const { connectionStatus } = useCurrentWallet();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const transferSUI = async (recipient: string, amount: bigint) => {
    try {
      if (!(connectionStatus === "connected")) {
        throw new Error("Wallet not connected");
      }

      // Create TransactionBlock manually
      const tx = new Transaction();

      const coin = tx.splitCoins(tx.gas, [tx.pure.u64(amount)]);
      tx.transferObjects([coin], tx.pure.address(recipient));

      // Execute the transaction using wallet.signAndExecuteTransactionBlock()
      const result = signAndExecuteTransaction({
        transaction: tx,
        chain: "sui:testnet",
      });

      console.log("Transfer successful! Digest:");
      return result;
    } catch (error) {
      console.error("Transfer failed:", error);
      throw error;
    }
  };

  return { transferSUI };
}

export default useTransferSUI;
