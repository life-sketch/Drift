import { useEffect, useState, useMemo } from 'react';
import { getTopCoins } from '../services/coingecko';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchMarketData = async () => {
    try {
      const data = await getTopCoins();
      if (data) setCoins(data);
    } catch (err) {
      console.error("DATA_FETCH_FAILURE:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    // 90 second interval to be safer with CoinGecko limits
    const interval = setInterval(fetchMarketData, 90000);
    return () => clearInterval(interval);
  }, []);

  // Use useMemo to prevent expensive filtering/sorting on every keystroke
  const displayedCoins = useMemo(() => {
    let result = coins.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.symbol.toLowerCase().includes(search.toLowerCase())
    );

    if (activeTab === 'TOP10') return result.slice(0, 10);

    if (activeTab === 'GAINERS') {
      return [...result]
        .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
        .slice(0, 20);
    }

    if (activeTab === 'LOSERS') {
      return [...result]
        .sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0))
        .slice(0, 20);
    }

    return result;
  }, [coins, search, activeTab]); // Only recalculate if one of these changes

  return (
    <Layout>
      <div className="space-y-6">
        {/* Search Bar - Styled for Terminal */}
        <div className="relative max-w-md">
          <span className="absolute left-3 top-2 text-green-500">{'>'}</span>
          <input
            type="text"
            placeholder="SEARCH_DATABASE..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-green-500/30 p-2 pl-8 outline-none focus:border-green-400 text-green-400 placeholder:text-green-900"
          />
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2">
          {['ALL', 'TOP10', 'GAINERS', 'LOSERS'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 text-xs border ${
                activeTab === tab 
                  ? 'bg-green-500 text-black border-green-500' 
                  : 'border-green-900 text-green-700 hover:border-green-500'
              } transition-all`}
            >
              [{tab}]
            </button>
          ))}
        </div>

        {/* Market Table */}
        <div className="border border-green-500/20 bg-black/40 rounded overflow-hidden">
          {loading ? (
            <div className="p-10 animate-pulse text-center">ACCESSING_DATA_CORES...</div>
          ) : (
            <div className="grid grid-cols-1 divide-y divide-green-500/10">
              {displayedCoins.map((coin) => (
                <Link key={coin.id} href={`/coin/${coin.id}`}>
                  <div className="grid grid-cols-3 p-4 hover:bg-green-500/5 cursor-pointer transition-colors group">
                    <span className="font-bold group-hover:text-green-300">
                      {coin.symbol.toUpperCase()}
                    </span>
                    <span className="text-right text-green-400">
                      ${coin.current_price.toLocaleString()}
                    </span>
                    <span className={`text-right ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {coin.price_change_percentage_24h?.toFixed(2)}%
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}