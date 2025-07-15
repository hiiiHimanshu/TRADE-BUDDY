'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, Star, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { Stock } from '@/lib/types';

interface StockSearchProps {
  onAddToWatchlist?: (symbol: string) => void;
  onSelectStock?: (stock: Stock) => void;
}

const popularStocks = [
  { 
    symbol: 'AAPL', 
    name: 'Apple Inc.', 
    price: 175.43, 
    previousPrice: 173.09,
    percentageChange: 1.35,
    volume: 50000000
  },
  { 
    symbol: 'GOOGL', 
    name: 'Alphabet Inc.', 
    price: 142.56, 
    previousPrice: 143.79,
    percentageChange: -0.86,
    volume: 25000000
  },
  { 
    symbol: 'MSFT', 
    name: 'Microsoft Corp.', 
    price: 378.85, 
    previousPrice: 373.18,
    percentageChange: 1.52,
    volume: 35000000
  },
  { 
    symbol: 'TSLA', 
    name: 'Tesla Inc.', 
    price: 248.50, 
    previousPrice: 251.71,
    percentageChange: -1.27,
    volume: 80000000
  },
  { 
    symbol: 'NVDA', 
    name: 'NVIDIA Corp.', 
    price: 450.12, 
    previousPrice: 441.22,
    percentageChange: 2.02,
    volume: 45000000
  },
];

export function StockSearch({ onAddToWatchlist, onSelectStock }: StockSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { stocks } = useStore();

  const searchStocks = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(popularStocks);
      return;
    }

    setIsLoading(true);
    
    // Simulate API search - in real app, this would call a stock search API
    setTimeout(() => {
      const filtered = [...stocks, ...popularStocks]
        .filter(stock => 
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 8);
      
      setResults(filtered);
      setIsLoading(false);
    }, 300);
  }, [stocks]);

  useEffect(() => {
    searchStocks(query);
  }, [query, searchStocks]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search stocks (e.g., AAPL, Apple)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-4 h-12 bg-background/50 backdrop-blur-sm border-2 border-primary/20 focus:border-primary/50 transition-colors"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuery('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="border-2 border-primary/20 shadow-xl backdrop-blur-sm bg-card/95">
              <CardContent className="p-4">
                {!query && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Popular Stocks
                    </h4>
                  </div>
                )}

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {isLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : results.length > 0 ? (
                    results.map((stock, index) => (
                      <motion.div
                        key={stock.symbol}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer group transition-colors"
                        onClick={() => {
                          onSelectStock?.(stock);
                          setIsOpen(false);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-bold">{stock.symbol.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">{stock.symbol}</span>
                              {!query && (
                                <Badge variant="secondary" className="text-xs">
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {stock.name}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <p className="font-semibold">${stock.price.toFixed(2)}</p>
                            <p className={`text-xs ${stock.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {stock.percentageChange >= 0 ? '+' : ''}{stock.percentageChange.toFixed(2)}%
                            </p>
                          </div>
                          
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddToWatchlist?.(stock.symbol);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectStock?.(stock);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No stocks found for &quot;{query}&quot;</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
