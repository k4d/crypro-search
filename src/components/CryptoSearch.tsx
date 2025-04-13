import { useState } from 'react';
import { searchCrypto } from '../services/cryptoApi';
import CryptoList from './CryptoList';

interface CryptoSearchProps {
  className?: string;
}

export default function CryptoSearch({ className = '' }: CryptoSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cryptoData, setCryptoData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await searchCrypto(searchTerm);
      setCryptoData(data.coins || []);
      if (data.coins.length === 0) {
        setError('No cryptocurrencies found matching your search');
      }
    } catch (err) {
      setError('Failed to fetch cryptocurrency data. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`container mx-auto max-w-4xl ${className}`}>
      <div className="prose prose-lg mx-auto mb-6 text-center">
        <h2 className="text-3xl font-bold text-crypto-primary-800">Search Cryptocurrencies</h2>
        <p className="text-crypto-neutral">Find real-time information about any cryptocurrency</p>
      </div>
      
      <div className="shadow-card hover:shadow-card-hover transition-shadow bg-white rounded-xl p-6 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a cryptocurrency (e.g., Bitcoin, Ethereum)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crypto-primary-500 focus:border-crypto-primary-500"
          />
          <button 
            type="submit"
            className="bg-crypto-primary-600 hover:bg-crypto-primary-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </span>
            ) : 'Search'}
          </button>
        </form>
      </div>
      
      {error && (
        <div className="bg-red-50 text-crypto-negative p-4 rounded-lg mb-6 text-center shadow-sm">
          {error}
        </div>
      )}
      
      {cryptoData.length > 0 && (
        <CryptoList cryptoData={cryptoData} />
      )}
    </div>
  );
}

