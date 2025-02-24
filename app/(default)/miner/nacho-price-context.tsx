'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { $fetch } from 'ofetch';

interface NachoPriceContextType {
  price: number | null;
  isLoading: boolean;
  error: string | null;
}

const NachoPriceContext = createContext<NachoPriceContextType>({
  price: null,
  isLoading: true,
  error: null,
});

export function NachoPriceProvider({ children }: { children: React.ReactNode }) {
  const [price, setPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await $fetch('/api/pool/nachoPrice');
        setPrice(response.data.price);
        setError(null);
      } catch (err) {
        setError('Failed to fetch NACHO price');
        console.error('Error fetching NACHO price:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrice();
    // Refresh price every 5 minutes
    const interval = setInterval(fetchPrice, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NachoPriceContext.Provider value={{ price, isLoading, error }}>
      {children}
    </NachoPriceContext.Provider>
  );
}

export function useNachoPrice() {
  return useContext(NachoPriceContext);
} 