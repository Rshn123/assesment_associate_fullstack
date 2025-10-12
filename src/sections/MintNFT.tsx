interface MintNFTProps {
  handleMintNft: () => void;
  mintDigest: string;
  loading: boolean;
}

export function MintNFT({ handleMintNft, mintDigest, loading }: MintNFTProps) {
  return (
    <section className="flex-1 m-1 bg-[#161b20] rounded-xl p-4 flex flex-col align-center justify-center">
      <button
        onClick={handleMintNft}
        className="bg-green-600 hover:bg-green-700 rounded-lg py-2 mt-3 text-sm font-semibold text-white transition-all"
        disabled={loading}
      >
        {loading ? "Minting..." : "Mint"}
      </button>
      <span className="text-xs">Current Digest: {mintDigest}</span>
    </section>
  );
}
