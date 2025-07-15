'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUpIcon, 
  TrendingDownIcon, 
  PieChartIcon, 
  BriefcaseIcon,
  DollarSignIcon
} from 'lucide-react';

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
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

const emptyStateVariants = {
  hidden: { opacity: 0, scale: 0.9 },
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

export function Portfolio() {
  const { user, stocks } = useStore();

  if (!user) return null;

  const getStockCurrentPrice = (symbol: string) => {
    return stocks.find((s) => s.symbol === symbol)?.price || 0;
  };

  const calculatePositionValue = (symbol: string, quantity: number) => {
    const currentPrice = getStockCurrentPrice(symbol);
    return currentPrice * quantity;
  };

  const calculateProfitLoss = (symbol: string) => {
    const position = user.portfolio[symbol];
    if (!position) return 0;
    const currentValue = calculatePositionValue(symbol, position.quantity);
    const costBasis = position.averagePrice * position.quantity;
    return currentValue - costBasis;
  };

  const getTotalPortfolioValue = () => {
    return Object.entries(user.portfolio).reduce((total, [symbol, position]) => {
      return total + calculatePositionValue(symbol, position.quantity);
    }, 0);
  };

  const getTotalProfitLoss = () => {
    return Object.keys(user.portfolio).reduce((total, symbol) => {
      return total + calculateProfitLoss(symbol);
    }, 0);
  };

  const getPositionPercentage = (symbol: string, quantity: number) => {
    const totalValue = getTotalPortfolioValue();
    if (totalValue === 0) return 0;
    const positionValue = calculatePositionValue(symbol, quantity);
    return (positionValue / totalValue) * 100;
  };

  const portfolioEntries = Object.entries(user.portfolio);
  const totalValue = getTotalPortfolioValue();
  const totalPL = getTotalProfitLoss();

  return (
    <Card className="border-2 border-primary/10">
      <CardHeader className="bg-gradient-to-r from-muted/30 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BriefcaseIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Your Portfolio
              </CardTitle>
              <CardDescription>Current positions and performance</CardDescription>
            </div>
          </div>
          {portfolioEntries.length > 0 && (
            <div className="text-right">
              <div className="text-2xl font-bold">
                ${totalValue.toFixed(2)}
              </div>
              <div className={`text-sm flex items-center justify-end ${
                totalPL >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {totalPL >= 0 ? (
                  <TrendingUpIcon className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDownIcon className="h-3 w-3 mr-1" />
                )}
                {totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {portfolioEntries.length > 0 ? (
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {portfolioEntries.map(([symbol, position], index) => {
                const profitLoss = calculateProfitLoss(symbol);
                const percentage = getPositionPercentage(symbol, position.quantity);
                const currentPrice = getStockCurrentPrice(symbol);
                const positionValue = calculatePositionValue(symbol, position.quantity);
                
                return (
                  <motion.div
                    key={symbol}
                    variants={itemVariants}
                    whileHover="hover"
                    layout
                  >
                    <Card className="p-4 border border-border/50 hover:border-primary/30 transition-colors duration-200 bg-gradient-to-r from-muted/10 to-transparent">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="font-bold text-sm">{symbol.charAt(0)}</span>
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-lg">{symbol}</h3>
                                <Badge variant="secondary" className="text-xs">
                                  {percentage.toFixed(1)}%
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {position.quantity} shares @ ${position.averagePrice.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              ${positionValue.toFixed(2)}
                            </p>
                            <div className={`text-sm flex items-center justify-end ${
                              profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {profitLoss >= 0 ? (
                                <TrendingUpIcon className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDownIcon className="h-3 w-3 mr-1" />
                              )}
                              {profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Position Weight</span>
                            <span>{percentage.toFixed(1)}%</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                        
                        <Separator />
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Current Price</p>
                            <p className="font-semibold">${currentPrice.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Total Value</p>
                            <p className="font-semibold">${positionValue.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-12"
              variants={emptyStateVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
                <PieChartIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No positions yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Start trading to build your portfolio! Buy some stocks to see them appear here with real-time performance tracking.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
