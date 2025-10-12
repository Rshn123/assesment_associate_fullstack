interface AccountInfoProps {
  network: string;
  currentAccount: any;
  balance: string;
  transcation: any[];
}

export function AccountInfo({
  network,
  currentAccount,
  balance,
  transcation,
}: AccountInfoProps) {
  return (
    <section className="bg-[#161b20] rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Yuna Information</h2>
        <div className="flex gap-2 text-sm text-gray-400">
          <label className="text-blue-600">Network:</label>
          <span>{network}</span>
        </div>
      </div>

      <div className="flex">
        <div className="flex-2 bg-[#1b1f25] rounded-lg h-48 p-4 text-gray-400 text-sm">
          <p className="mb-2">
            <span className="text-white font-semibold">Address:</span>
          </p>
          <p className="break-all text-gray-300">{currentAccount?.address}</p>
        </div>

        <div className="flex-1 ml-4 bg-[#1b1f25] rounded-lg h-48 p-4 text-gray-400 text-sm">
          <p>
            <span className="text-white font-semibold">Balance:</span>
          </p>
          <p className="text-gray-300 text-lg font-medium">{balance} SUI</p>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm text-gray-400 mb-2">Recent Trades</h3>
        <div className="bg-[#1b1f25] rounded-lg p-3 text-xs text-gray-300">
          <div className="h-[100px] overflow-auto">
            {transcation.map((val, i) => (
              <li key={i}>{val.digest}</li>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
