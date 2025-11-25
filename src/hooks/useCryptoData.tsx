
import { useState, useEffect } from 'react';
import { marketService, type CoinPrice } from '@/services/apiService';

interface Coin extends CoinPrice {
  price_history?: Array<{ date: string, price: number }>;
}

export function useCryptoData() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch real market data from backend
        const data = await marketService.getPrices();

        // Transform API data to match component expectations
        const transformedCoins = data.map(coin => ({
          ...coin,
          price_history: [] // Will be fetched separately if needed
        }));

        setCoins(transformedCoins);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch crypto data:', err);
        setError(err as Error);
        // Keep existing data on error to avoid blank screen
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Periodically update data every 60 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Function to get a single coin by ID
  const getCoin = (id: string) => {
    return coins.find(coin => coin.id === id);
  };

  // Function to get price history for a coin
  const getPriceHistory = (id: string) => {
    const coin = coins.find(coin => coin.id === id);
    return coin?.price_history || [];
  };

  return { coins, isLoading, error, getCoin, getPriceHistory };
}
