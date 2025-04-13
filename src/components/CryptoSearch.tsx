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
  const [showClearButton, setShowClearButton] = useState(false);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowClearButton(value.length > 0);
  };

  const handleClear = () => {
    setSearchTerm('');
    setCryptoData([]);
    setError(null);
    setShowClearButton(false);
  };

  return (
    <div className={`container mx-auto max-w-4xl ${className}`}>
      <div className="prose prose-lg mx-auto mb-6 text-center">
        <h2 className="text-3xl font-bold text-crypto-primary-800">Search Cryptocurrencies</h2>
        <p className="text-crypto-neutral">Find real-time information about any cryptocurrency</p>
      </div>

      <div className="shadow-card hover:shadow-card-hover transition-shadow bg-white rounded-xl p-6 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search for a cryptocurrency (e.g., Bitcoin, Ethereum)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crypto-primary-500 focus:border-crypto-primary-500"
            />
            {showClearButton && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 right-3 flex items-center px-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
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

