import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import Layout from '../../components/Layout';
import { getCoinDetails } from '../../services/coingecko';
import { getDexPairsByAddress } from '../../services/dexscreener';

export default function CoinDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [platforms, setPlatforms] = useState({});
  const [selectedChain, setSelectedChain] = useState(null);
  const [pairs, setPairs] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Metadata & Auto-select first chain
  useEffect(() => {
    if (!id) return;

    getCoinDetails(id)
      .then((data) => {
        setPlatforms(data.platforms || {});
        // Auto-select the first valid chain found
        const availableChains = Object.keys(data.platforms || {}).filter(c => data.platforms[c]);
        if (availableChains.length > 0) {
          setSelectedChain(availableChains[0]);
        }
      })
      .catch(console.error);
  }, [id]);

  // 2. Fetch Dex Data
  useEffect(() => {
    const contractAddress = platforms[selectedChain];
    if (!selectedChain || !contractAddress) return;

    setLoading(true);
    getDexPairsByAddress(contractAddress)
      .then(setPairs)
      .catch(() => setPairs([]))
      .finally(() => setLoading(false));
  }, [selectedChain, platforms]);

  const chains = Object.keys(platforms).filter((c) => platforms[c]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Breadcrumb / Header */}
        <div className="border-l-4 border-green-500 pl-4">
          <h2 className="text-3xl font-bold uppercase tracking-tighter text-green-400">
            ASSET_REPORT: {id}
          </h2>
          <p className="text-xs text-green-900">ID_REF: {id?.toUpperCase()}</p>
        </div>

        {/* Chain Selector */}
        <div className="flex flex-wrap gap-2 border-b border-green-900 pb-4">
          {chains.map((chain) => (
            <button
              key={chain}
              onClick={() => setSelectedChain(chain)}
              className={`px-3 py-1 text-[10px] uppercase transition-all ${
                selectedChain === chain
                  ? 'bg-green-500 text-black font-bold'
                  : 'bg-green-900/20 text-green-700 hover:bg-green-900/40'
              }`}
            >
              {chain}
            </button>
          ))}
        </div>

        {/* Pairs Display */}
        <div className="grid gap-4">
          {loading ? (
            <div className="py-20 text-center animate-pulse text-green-800">
              SCANNING_DEX_LIQUIDITY_POOLS...
            </div>
          ) : pairs.length > 0 ? (
            pairs.map((p, i) => (
              <div 
                key={i} 
                className="border border-green-500/20 bg-green-900/5 p-4 flex justify-between items-center hover:border-green-500/50 transition-colors"
              >
                <div>
                  <div className="text-lg font-bold">
                    {p.baseToken.symbol}/{p.quoteToken.symbol}
                  </div>
                  <div className="text-[10px] text-green-800 uppercase">
                    DEX: {p.dexId} | CHAIN: {p.chainId}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl text-green-400 font-mono">
                    ${parseFloat(p.priceUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </div>
                  <div className="text-[10px] text-green-700">
                    LIQ: ${p.liquidity?.usd?.toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-green-900 border border-dashed border-green-900">
              NO_ACTIVE_POOLS_FOUND_FOR_SELECTED_CHAIN
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}