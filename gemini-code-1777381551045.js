const DEX_BASE = 'https://api.dexscreener.com/latest/dex';

export const getDexPairsByAddress = async (contractAddress) => {
  // 1. Guard clause with normalization
  if (!contractAddress) return [];
  const normalizedAddress = contractAddress.toLowerCase().trim();

  try {
    const res = await fetch(`${DEX_BASE}/tokens/${normalizedAddress}`);
    
    if (!res.ok) {
        if (res.status === 404) return []; // Token not found isn't necessarily an "error"
        throw new Error(`Dexscreener error: ${res.status}`);
    }

    const data = await res.json();
    
    // 2. Safe access to pairs
    if (!data || !Array.isArray(data.pairs)) return [];

    // 3. Single-pass processing is cleaner
    const uniqueMap = {};

    data.pairs.forEach((pair) => {
      // Filter: Only keep pools with > $10k liquidity
      if ((pair.liquidity?.usd || 0) < 10000) return;

      // Define uniqueness: usually chain + base + quote
      // We lowercase everything to be safe
      const chain = pair.chainId.toLowerCase();
      const base = pair.baseToken.symbol.toLowerCase();
      const quote = pair.quoteToken.symbol.toLowerCase();
      const key = `${chain}-${base}-${quote}`;

      // 4. Keep the pool with the highest liquidity
      if (!uniqueMap[key] || (uniqueMap[key].liquidity?.usd || 0) < pair.liquidity.usd) {
        uniqueMap[key] = {
          ...pair,
          chainId: chain // Standardize case
        };
      }
    });

    // 5. Final sort by liquidity
    return Object.values(uniqueMap).sort(
      (a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
    );

  } catch (err) {
    console.error('Dexscreener Fetch Error:', err);
    return [];
  }
};