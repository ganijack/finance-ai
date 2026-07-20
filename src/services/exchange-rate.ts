// Exchange Rate Service using Frankfurter API (free, no API key needed)
// https://www.frankfurter.app/

interface ExchangeRateCache {
  rates: Record<string, number>;
  base: string;
  timestamp: number;
}

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
const rateCache: Map<string, ExchangeRateCache> = new Map();

/**
 * Get exchange rate from one currency to another
 */
export async function getExchangeRate(from: string, to: string): Promise<number> {
  if (from === to) return 1;

  const cacheKey = `${from}_${to}`;
  const cached = rateCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.rates[to] || 1;
  }

  try {
    const response = await fetch(
      `https://api.frankfurter.app/latest?from=${from}&to=${to}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour in Next.js
    );

    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.statusText}`);
    }

    const data = await response.json();
    const rate = data.rates[to];

    if (!rate) {
      throw new Error(`No rate found for ${from} to ${to}`);
    }

    // Cache the result
    rateCache.set(cacheKey, {
      rates: data.rates,
      base: from,
      timestamp: Date.now(),
    });

    return rate;
  } catch (error) {
    console.error("Exchange rate fetch error:", error);
    // Return 1 as fallback to prevent data corruption
    throw new Error(`Failed to fetch exchange rate from ${from} to ${to}`);
  }
}

/**
 * Convert an amount from one currency to another
 */
export async function convertAmount(
  amount: number,
  from: string,
  to: string
): Promise<number> {
  if (from === to) return amount;

  const rate = await getExchangeRate(from, to);
  return Math.round(amount * rate * 100) / 100; // Round to 2 decimal places
}

/**
 * Batch convert multiple amounts
 */
export async function batchConvertAmounts(
  amounts: { id: string; amount: number }[],
  from: string,
  to: string
): Promise<{ id: string; convertedAmount: number }[]> {
  const rate = await getExchangeRate(from, to);

  return amounts.map(item => ({
    id: item.id,
    convertedAmount: Math.round(item.amount * rate * 100) / 100,
  }));
}
