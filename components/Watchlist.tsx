'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, TrendingUp, TrendingDown, X, Plus, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/lib/store';
import { Stock } from '@/lib/types';

interface WatchlistItem extends Stock {
  addedAt: Date;
  alertPrice?: number;
}

export function Watchlist() {
  const { stocks } = useStore();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([
    {
      ...stocks[0],
      addedAt: new Date(),
      alertPrice: stocks[0].price * 1.1,
    },
    {
      ...stocks[1], 
      addedAt: new Date(),
    },
  ]);

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
  };

  const addToWatchlist = (stock: Stock) => {
    const exists = watchlist.find(item => item.symbol === stock.symbol);
    if (!exists) {
      setWatchlist(prev => [...prev, {
        ...stock,
        addedAt: new Date(),
      }]);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2,
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25,
      },
    },
  };

  return (
    <Card className="border-2 border-primary/10">
      <CardHeader className="bg-gradient-to-r from-muted/30 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Star className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Watchlist
                <Badge variant="secondary">{watchlist.length}</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">Track your favorite stocks</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-8">
            <Plus className="h-4 w-4 mr-2" />
            Add Stock
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {watchlist.length > 0 ? (
            <motion.div
              className="space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {watchlist.map((stock, index) => {
                const priceChange = stock.price - stock.previousPrice;
                const isPositive = priceChange >= 0;
                
                return (
                  <motion.div
                    key={stock.symbol}
                    variants={itemVariants}
                    whileHover="hover"
                    exit="exit"
                    layout
                  >
                    <Card className="p-4 border border-border/50 hover:border-primary/30 transition-colors duration-200 bg-gradient-to-r from-muted/10 to-transparent">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-bold text-sm">{stock.symbol.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold">{stock.symbol}</h3>
                              {stock.alertPrice && (
                                <Badge variant="outline" className="text-xs">
                                  Alert: ${stock.alertPrice.toFixed(2)}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate max-w-[150px]">
                              {stock.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Added {stock.addedAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="font-bold text-lg">${stock.price.toFixed(2)}</p>
                            <div className={`text-sm flex items-center justify-end ${
                              isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {isPositive ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              {isPositive ? '+' : ''}${priceChange.toFixed(2)}
                            </div>
                          </div>

                          <div className="flex flex-col space-y-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-primary/10"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromWatchlist(stock.symbol)}
                              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Price Alert Indicator */}
                      {stock.alertPrice && (
                        <>
                          <Separator className="my-3" />
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Price Alert</span>
                            <div className="flex items-center space-x-2">
                              <span className={`font-medium ${
                                stock.price >= stock.alertPrice ? 'text-green-600' : 'text-muted-foreground'
                              }`}>
                                ${stock.alertPrice.toFixed(2)}
                              </span>
                              {stock.price >= stock.alertPrice && (
                                <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                                  Triggered
                                </Badge>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No stocks in watchlist</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                Add stocks to your watchlist to track their performance and set price alerts.
              </p>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Stock
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
