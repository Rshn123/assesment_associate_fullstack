import { ChangeEvent } from "react";

interface SendSUIProps {
  recipient: string;
  amount: string;
  invalidAddressError: string;
  invalidAmountError: string;
  handleAddressChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleAmountChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleTransfer: () => void;
  loading: boolean;
  digest: string;
}

export function SendSUI({
  recipient,
  amount,
  invalidAddressError,
  invalidAmountError,
  handleAddressChange,
  handleAmountChange,
  handleTransfer,
  loading,
  digest,
}: SendSUIProps) {
  return (
    <section className="flex-1 m-1 bg-[#161b20] rounded-xl p-4 flex flex-col justify-between">
      <h2 className="text-lg mb-3 font-semibold">Send SUI</h2>

      <label className="text-sm mb-1">Recipient Address:</label>
      <input
        type="text"
        placeholder="0x..."
        value={recipient}
        onChange={handleAddressChange}
        className="w-full bg-[#1b1f25] border border-gray-700 rounded-lg p-2 text-sm text-gray-300"
      />
      {invalidAddressError && (
        <p className="text-red-500 text-xs mt-1">{invalidAddressError}</p>
      )}

      <label className="text-sm mt-4 mb-1">Amount (SUI):</label>
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={handleAmountChange}
        className="w-full bg-[#1b1f25] border border-gray-700 rounded-lg p-2 text-sm text-gray-300"
      />
      {invalidAmountError && (
        <p className="text-red-500 text-xs mt-1">{invalidAmountError}</p>
      )}

      <div className="flex justify-between text-xs mt-3 text-gray-500">
        <span>1 SUI</span>
        <span>$3.48</span>
      </div>

      <button
        onClick={handleTransfer}
        className="bg-green-600 hover:bg-green-700 rounded-lg py-2 mt-3 text-sm font-semibold text-white transition-all"
        disabled={loading}
      >
        {loading ? "Transferring....." : "Send Transaction"}
      </button>
      <span className="text-xs">Current Digest: {digest}</span>
    </section>
  );
}
