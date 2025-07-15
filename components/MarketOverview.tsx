'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { fetchRealTimeStockData } from '@/lib/stockApi';
import { generateMockPriceUpdate } from '@/lib/mockData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowUpIcon, ArrowDownIcon, WifiIcon, WifiOffIcon, RefreshCwIcon, TrendingUpIcon, BarChart3Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiSetupGuide } from '@/components/ApiSetupGuide';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.1,
    },
  },
};

const rowVariants = {
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
    scale: 1.01,
    backgroundColor: "hsl(var(--muted) / 0.5)",
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
    },
  },
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

export default function MarketOverview() {
  const { stocks, updateStocks } = useStore();
  const [isUsingRealData, setIsUsingRealData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedStocks, setUpdatedStocks] = useState<Set<string>>(new Set());

  const fetchAndUpdateStocks = useCallback(async () => {
    setIsLoading(true);
    try {
      const realTimeStocks = await fetchRealTimeStockData();
      updateStocks(realTimeStocks);
      setIsUsingRealData(true);
      setLastUpdated(new Date());
      
      // Track which stocks were updated for animation
      setUpdatedStocks(new Set(realTimeStocks.map(stock => stock.symbol)));
      setTimeout(() => setUpdatedStocks(new Set()), 2000);
      
      console.log('✅ Successfully loaded real-time stock data');
    } catch (error) {
      console.error('❌ Failed to load real-time data, using mock data:', error);
      const updatedStocks = stocks.map(generateMockPriceUpdate);
      updateStocks(updatedStocks);
      setIsUsingRealData(false);
      setLastUpdated(new Date());
      
      // Track which stocks were updated for animation
      setUpdatedStocks(new Set(updatedStocks.map(stock => stock.symbol)));
      setTimeout(() => setUpdatedStocks(new Set()), 2000);
    } finally {
      setIsLoading(false);
    }
  }, [stocks, updateStocks]);

  useEffect(() => {
    // Initial load
    fetchAndUpdateStocks();

    // Set up interval for updates
    const interval = setInterval(fetchAndUpdateStocks, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [fetchAndUpdateStocks]);

  const handleManualRefresh = () => {
    fetchAndUpdateStocks();
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="border-2 border-primary/10 overflow-hidden">
        {/* Enhanced Header */}
        <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Market Overview</CardTitle>
                <p className="text-sm text-muted-foreground">Real-time market data</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.div
                className="flex items-center space-x-2 text-sm"
                variants={isUsingRealData ? pulseVariants : {}}
                animate={isUsingRealData ? "pulse" : ""}
              >
                {isUsingRealData ? (
                  <>
                    <WifiIcon className="h-4 w-4 text-green-500" />
                    <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                      Live Data
                    </Badge>
                  </>
                ) : (
                  <>
                    <WifiOffIcon className="h-4 w-4 text-orange-500" />
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                      Demo Data
                    </Badge>
                  </>
                )}
                {lastUpdated && (
                  <span className="text-muted-foreground">
                    • {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </motion.div>
              
              <div className="flex items-center space-x-2">
                <ApiSetupGuide />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualRefresh}
                  disabled={isLoading}
                  className="hover:bg-primary/5 hover:border-primary/30"
                >
                  <RefreshCwIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-semibold">Symbol</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="text-right font-semibold">Price</TableHead>
                  <TableHead className="text-right font-semibold">Change</TableHead>
                  <TableHead className="text-right font-semibold">Volume</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {stocks.map((stock, index) => (
                    <motion.tr
                      key={stock.symbol}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      transition={{ delay: index * 0.05 }}
                      className={`cursor-pointer border-b border-border/50 ${
                        updatedStocks.has(stock.symbol) ? 'bg-primary/5' : ''
                      }`}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                            {stock.symbol.charAt(0)}
                          </div>
                          <span>{stock.symbol}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{stock.name}</TableCell>
                      <TableCell className="text-right">
                        <motion.span
                          className="font-bold text-lg"
                          animate={updatedStocks.has(stock.symbol) ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          ${stock.price.toFixed(2)}
                        </motion.span>
                      </TableCell>
                      <TableCell className="text-right">
                        <motion.div
                          className={`flex items-center justify-end space-x-1 ${
                            stock.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                          animate={updatedStocks.has(stock.symbol) ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          {stock.percentageChange >= 0 ? (
                            <ArrowUpIcon className="h-4 w-4" />
                          ) : (
                            <ArrowDownIcon className="h-4 w-4" />
                          )}
                          <span className="font-semibold">
                            {Math.abs(stock.percentageChange).toFixed(2)}%
                          </span>
                        </motion.div>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {stock.volume.toLocaleString()}
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}