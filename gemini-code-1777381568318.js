export const formatCurrency = (num) => {
  if (num === 0) return '$0.00';
  if (!num) return '$---'; // Distinguish between zero and missing data

  // If the price is less than $1, show up to 6 decimals
  const digits = num < 1 ? 6 : 2;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  }).format(num);
};

export const formatPercent = (num) => {
  if (num === undefined || num === null) return '0.00%';
  const sign = num > 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
};

export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    // We clear the existing timeout to "reset" the clock
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args); // Using apply ensures 'this' context is preserved
    }, delay);
  };
};