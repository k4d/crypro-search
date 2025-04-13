import React from 'react';

interface CryptoListProps {
  cryptoData: Array<{
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    large: string;
    price_change_percentage_24h?: number;
    market_cap?: number;
    current_price?: number;
  }>;
}

export default function CryptoList({ cryptoData }: CryptoListProps) {
  // Function to render price change indicator
  const renderPriceChange = (priceChange?: number) => {
    if (priceChange === undefined) return null;
    
    const isPositive = priceChange >= 0;
    const roundedChange = Math.abs(priceChange).toFixed(2);
    
    return (
      <span 
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isPositive ? 'bg-green-100 text-crypto-positive' : 'bg-red-100 text-crypto-negative'
        }`}
      >
        {isPositive ? '↑' : '↓'} {roundedChange}%
      </span>
    );
  };

  // Function to format numbers for display
  const formatNumber = (num?: number) => {
    if (num === undefined) return 'N/A';
    
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };
  
  return (
    <div className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow overflow-hidden">
      <div className="bg-gradient-to-r from-crypto-primary-700 to-crypto-primary-900 text-white p-5">
        <h3 className="text-2xl font-bold">Search Results</h3>
        <p className="text-crypto-primary-100 mt-1">Click on any cryptocurrency to view more details</p>
      </div>
      
      <ul className="divide-y divide-gray-200">
        {cryptoData.map((crypto) => (
          <li key={crypto.id} className="p-5 hover:bg-gray-50 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-lg mr-4">
                  <img 
                    src={crypto.large || crypto.thumb} 
                    alt={`${crypto.name} logo`} 
                    className="w-12 h-12 object-contain"
                  />
                </div>
                
                <div>
                  <div className="flex flex-wrap gap-2 items-baseline">
                    <h4 className="text-lg font-bold text-gray-900">{crypto.name}</h4>
                    <span className="text-gray-500 text-sm uppercase font-mono">{crypto.symbol}</span>
                    {renderPriceChange(crypto.price_change_percentage_24h)}
                  </div>
                  
                  <div className="mt-1 flex flex-wrap gap-x-4 text-sm">
                    <span className="text-crypto-neutral">
                      Rank <span className="font-semibold">#{crypto.market_cap_rank || 'N/A'}</span>
                    </span>
                    {crypto.market_cap && (
                      <span className="text-crypto-neutral">
                        Market Cap: <span className="font-semibold">{formatNumber(crypto.market_cap)}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="ml-auto flex items-center gap-3 sm:mt-0 mt-2">
                {crypto.current_price && (
                  <span className="font-bold text-lg">{formatNumber(crypto.current_price)}</span>
                )}
                <a 
                  href={`https://www.coingecko.com/en/coins/${crypto.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-crypto-primary-50 hover:bg-crypto-primary-100 text-crypto-primary-700 font-medium px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  View Details
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

