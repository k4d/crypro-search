const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

/**
 * Search for cryptocurrencies by name or symbol
 * @param query - Search term
 * @returns Promise with search results
 */
export async function searchCrypto(query: string) {
  try {
    // First search for coins by name/symbol
    const response = await fetch(`${COINGECKO_BASE_URL}/search?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const searchData = await response.json();
    
    // If we have coins, try to fetch more detailed market data for the top results
    // This might hit rate limits on the free API tier
    if (searchData.coins && searchData.coins.length > 0) {
      try {
        // Get the IDs of the top 10 coins from search results
        const coinIds = searchData.coins.slice(0, 10).map((coin: any) => coin.id).join(',');
        
        // Fetch more detailed market data
        const marketResponse = await fetch(
          `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=10&page=1&sparkline=false`
        );
        
        if (marketResponse.ok) {
          const marketData = await marketResponse.json();
          
          // Merge market data with search results
          searchData.coins = searchData.coins.map((coin: any) => {
            const marketInfo = marketData.find((market: any) => market.id === coin.id);
            return marketInfo ? { ...coin, ...marketInfo } : coin;
          });
        }
      } catch (err) {
        // If this fails, we still have the basic search data
        console.error('Error fetching additional market data:', err);
      }
    }
    
    return searchData;
  } catch (error) {
    console.error('Error searching for cryptocurrencies:', error);
    throw error;
  }
}

/**
 * Get trending cryptocurrencies
 * @returns Promise with trending cryptocurrencies
 */
export async function getTrendingCryptos() {
  try {
    const response = await fetch(`${COINGECKO_BASE_URL}/search/trending`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching trending cryptocurrencies:', error);
    throw error;
  }
}

/**
 * Get detailed information for a specific cryptocurrency
 * @param id - Cryptocurrency ID
 * @returns Promise with cryptocurrency details
 */
export async function getCryptoDetails(id: string) {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching details for cryptocurrency ${id}:`, error);
    throw error;
  }
}

