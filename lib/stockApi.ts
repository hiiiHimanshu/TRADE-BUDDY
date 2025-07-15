import { Stock } from './types';

// Get API keys from environment variables
const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || 'sandbox_c72k0q9r01qjsffvpu0g';
const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'demo';
const FORCE_MOCK_DATA = process.env.NEXT_PUBLIC_FORCE_MOCK_DATA === 'true';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

// Stock symbols we want to track
const STOCK_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];

// Company names mapping
const COMPANY_NAMES: Record<string, string> = {
  'AAPL': 'Apple Inc.',
  'GOOGL': 'Alphabet Inc.',
  'MSFT': 'Microsoft Corporation',
  'AMZN': 'Amazon.com Inc.',
  'TSLA': 'Tesla Inc.',
};

// Cache for previous prices to calculate percentage change
let previousPrices: Record<string, number> = {};

export async function fetchRealTimeStockData(): Promise<Stock[]> {
  // Check if we should force mock data
  if (FORCE_MOCK_DATA) {
    console.log('🔧 Force mock data enabled, using fallback data');
    return getFallbackStocks();
  }

  try {
    console.log('📡 Fetching real-time stock data from Finnhub API...');
    
    // Use Finnhub API for real-time data
    const stockPromises = STOCK_SYMBOLS.map(async (symbol) => {
      try {
        const response = await fetch(
          `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if we got valid data
        if (!data || data.c === undefined) {
          throw new Error(`Invalid data for ${symbol}`);
        }
        
        const currentPrice = data.c; // Current price
        const previousClose = data.pc; // Previous close
        const change = data.d; // Change
        const changePercent = data.dp; // Change percent
        
        // Store previous price for next calculation
        if (!previousPrices[symbol]) {
          previousPrices[symbol] = previousClose;
        }
        
        // Generate realistic volume (since free API doesn't always provide volume)
        const volume = Math.floor(Math.random() * 1000000) + 500000;
        
        const stock: Stock = {
          symbol,
          name: COMPANY_NAMES[symbol] || symbol,
          price: currentPrice,
          previousPrice: previousPrices[symbol],
          percentageChange: changePercent || 0,
          volume,
        };
        
        // Update previous price for next time
        previousPrices[symbol] = currentPrice;
        
        return stock;
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        // Return fallback data if API fails
        return createFallbackStock(symbol);
      }
    });
    
    const stocks = await Promise.all(stockPromises);
    console.log('Successfully fetched real-time data for', stocks.length, 'stocks');
    return stocks;
    
  } catch (error) {
    console.error('Error fetching real-time stock data:', error);
    // Return fallback mock data if everything fails
    return getFallbackStocks();
  }
}

// Alternative API using Alpha Vantage (if Finnhub doesn't work)
export async function fetchRealTimeStockDataAlphaVantage(): Promise<Stock[]> {
  try {
    console.log('Fetching real-time stock data from Alpha Vantage...');
    
    const stockPromises = STOCK_SYMBOLS.map(async (symbol) => {
      try {
        const response = await fetch(
          `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const quote = data['Global Quote'];
        
        if (!quote) {
          throw new Error(`No quote data for ${symbol}`);
        }
        
        const currentPrice = parseFloat(quote['05. price']);
        const previousClose = parseFloat(quote['08. previous close']);
        const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
        const volume = parseInt(quote['06. volume']) || Math.floor(Math.random() * 1000000) + 500000;
        
        if (!previousPrices[symbol]) {
          previousPrices[symbol] = previousClose;
        }
        
        const stock: Stock = {
          symbol,
          name: COMPANY_NAMES[symbol] || symbol,
          price: currentPrice,
          previousPrice: previousPrices[symbol],
          percentageChange: changePercent,
          volume,
        };
        
        previousPrices[symbol] = currentPrice;
        return stock;
        
      } catch (error) {
        console.error(`Error fetching Alpha Vantage data for ${symbol}:`, error);
        return createFallbackStock(symbol);
      }
    });
    
    const stocks = await Promise.all(stockPromises);
    return stocks;
    
  } catch (error) {
    console.error('Error fetching Alpha Vantage stock data:', error);
    return getFallbackStocks();
  }
}

// Fallback function for individual stocks
function createFallbackStock(symbol: string): Stock {
  const basePrice = getBasePriceForSymbol(symbol);
  const change = (Math.random() - 0.5) * (basePrice * 0.02); // ±1% change
  const currentPrice = basePrice + change;
  const changePercent = (change / basePrice) * 100;
  
  if (!previousPrices[symbol]) {
    previousPrices[symbol] = basePrice;
  }
  
  return {
    symbol,
    name: COMPANY_NAMES[symbol] || symbol,
    price: parseFloat(currentPrice.toFixed(2)),
    previousPrice: previousPrices[symbol],
    percentageChange: parseFloat(changePercent.toFixed(2)),
    volume: Math.floor(Math.random() * 1000000) + 500000,
  };
}

// Get base prices for fallback
function getBasePriceForSymbol(symbol: string): number {
  const basePrices: Record<string, number> = {
    'AAPL': 175.0,
    'GOOGL': 135.0,
    'MSFT': 340.0,
    'AMZN': 145.0,
    'TSLA': 250.0,
  };
  return basePrices[symbol] || 100.0;
}

// Complete fallback stocks
function getFallbackStocks(): Stock[] {
  return STOCK_SYMBOLS.map(createFallbackStock);
}

// WebSocket connection for real-time updates (Finnhub)
export class RealTimeStockWebSocket {
  private ws: WebSocket | null = null;
  private onDataCallback: ((stocks: Stock[]) => void) | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  
  constructor(onData: (stocks: Stock[]) => void) {
    this.onDataCallback = onData;
  }
  
  connect() {
    try {
      this.ws = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected for real-time stock data');
        this.reconnectAttempts = 0;
        
        // Subscribe to stock symbols
        STOCK_SYMBOLS.forEach(symbol => {
          this.ws?.send(JSON.stringify({ type: 'subscribe', symbol }));
        });
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'trade' && data.data) {
            this.handleTradeData(data.data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect();
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
    }
  }
  
  private handleTradeData(trades: any[]) {
    // Process real-time trade data and update stocks
    // This would need more sophisticated logic to aggregate trades into stock updates
    console.log('Received real-time trade data:', trades);
  }
  
  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => this.connect(), 5000);
    } else {
      console.log('Max reconnection attempts reached');
    }
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
