const CG_BASE = 'https://api.coingecko.com/api/v3';

// Helper to handle response checks
const handleResponse = async (res, errorMsg) => {
  if (!res.ok) {
    // Check for rate limit specifically
    if (res.status === 429) throw new Error('CoinGecko Rate Limit Reached');
    throw new Error(errorMsg);
  }
  return res.json();
};

export const getGlobalStats = async () => {
  try {
    const res = await fetch(`${CG_BASE}/global`);
    const data = await handleResponse(res, 'Failed to fetch global stats');
    return data.data;
  } catch (err) {
    console.error(err);
    return null; // Return null or stale cache instead of crashing
  }
};

export const getTopCoins = async (limit = 100) => {
  try {
    const res = await fetch(
      `${CG_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=24h`
    );
    return await handleResponse(res, 'Failed to fetch top coins');
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getCoinDetails = async (id) => {
  try {
    const res = await fetch(
      `${CG_BASE}/coins/${id}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`
    );
    const data = await handleResponse(res, 'Failed to fetch coin details');

    return {
      name: data?.name || 'Unknown',
      symbol: data?.symbol?.toUpperCase() || '',
      platforms: data?.platforms || {},
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};