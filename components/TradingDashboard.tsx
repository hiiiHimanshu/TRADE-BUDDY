'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TradeModal } from '@/components/TradeModal';
import { Stock } from '@/lib/types';
import { Portfolio } from '@/components/Portfolio';
import { TradeHistory } from '@/components/TradeHistory';
import { TrendingUpIcon, TrendingDownIcon, DollarSignIcon, Activity } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
};

const stockItemVariants = {
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
  hover: {
    scale: 1.02,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
    },
  },
};

export default function TradingDashboard() {
  const { stocks, user } = useStore();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  const handleTrade = (stock: Stock, type: 'buy' | 'sell') => {
    setSelectedStock(stock);
    setTradeType(type);
  };

  if (!user) {
    return (
      <motion.div variants={cardVariants} initial="hidden" animate="visible">
        <Card className="border-dashed">
          <CardHeader className="text-center">
            <DollarSignIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Please log in to start trading</CardDescription>
          </CardHeader>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="border-2 border-primary/10 bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Dashboard
              </CardTitle>
              <CardDescription>Your trading overview</CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg font-bold px-3 py-1">
              ${user.balance.toFixed(2)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="mb-6" />
          <div className="space-y-3">
            <AnimatePresence>
              {stocks.map((stock, index) => (
                <motion.div
                  key={stock.symbol}
                  variants={stockItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="p-4 border border-border/50 hover:border-primary/30 transition-colors duration-200 bg-gradient-to-r from-muted/20 to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-bold text-sm">{stock.symbol.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {stock.symbol}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold">
                              ${stock.price.toFixed(2)}
                            </span>
                            <Badge
                              variant={stock.percentageChange >= 0 ? "default" : "destructive"}
                              className="text-xs"
                            >
                              {stock.percentageChange >= 0 ? (
                                <TrendingUpIcon className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDownIcon className="h-3 w-3 mr-1" />
                              )}
                              {Math.abs(stock.percentageChange).toFixed(2)}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTrade(stock, 'buy')}
                          className="hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors"
                        >
                          Buy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTrade(stock, 'sell')}
                          className="hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors"
                        >
                          Sell
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Portfolio />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <TradeHistory />
      </motion.div>

      <AnimatePresence>
        {selectedStock && (
          <TradeModal
            stock={selectedStock}
            type={tradeType}
            onClose={() => setSelectedStock(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
