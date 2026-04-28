import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getGlobalStats } from '../services/coingecko';

export default function Layout({ children }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    getGlobalStats()
      .then((data) => {
        if (isMounted) setStats(data);
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setError(true);
      });

    return () => { isMounted = false; }; // Cleanup to prevent memory leaks
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-green-500 font-mono selection:bg-green-900 selection:text-green-100">
      <header className="sticky top-0 z-50 bg-black/95 border-b border-green-500/30 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <Link href="/">
            <h1 className="text-2xl font-bold tracking-widest text-green-400 hover:text-green-300 transition-colors">
              SYS_TERMINAL<span className="animate-pulse">_</span>
            </h1>
          </Link>

          <div className="flex items-center space-x-4">
            <span className={`flex items-center text-[10px] font-bold px-2 py-1 ${error ? 'bg-red-900/30 text-red-500' : 'bg-green-900/30'}`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${error ? 'bg-red-500' : 'bg-green-400 animate-ping'}`}></span>
              {error ? 'CONNECTION_LOST' : 'LIVE_FEED'}
            </span>
          </div>
        </div>

        {/* Ticker Section */}
        <div className="overflow-hidden border-t border-green-500/20 bg-green-900/10 py-1 h-[26px]">
          {!stats && !error ? (
            <div className="px-6 text-[11px] animate-pulse">INITIALIZING_DATA_STREAM...</div>
          ) : stats ? (
            <div className="animate-marquee whitespace-nowrap text-[11px] flex space-x-12 w-max">
              <span>BTC_DOM: {stats.market_cap_percentage?.btc?.toFixed(2)}%</span>
              <span>24H_VOL: ${stats.total_volume?.usd?.toLocaleString()}</span>
              <span>ACTIVE_ASSETS: {stats.active_cryptocurrencies}</span>
              {/* Duplicate for seamless loop if using CSS marquee */}
              <span className="opacity-50">SYS_ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
            </div>
          ) : null}
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        {children}
      </main>

      {/* Optional: Add a subtle Scanline effect */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
    </div>
  );
}