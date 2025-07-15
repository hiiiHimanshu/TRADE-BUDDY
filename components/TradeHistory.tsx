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
import { Separator } from '@/components/ui/separator';
import { TrendingUpIcon, TrendingDownIcon, HistoryIcon, FileTextIcon } from 'lucide-react';

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

export function TradeHistory() {
  const { trades } = useStore();

  return (
    <Card className="border-2 border-primary/10">
      <CardHeader className="bg-gradient-to-r from-muted/30 to-transparent">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <HistoryIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              Trade History
            </CardTitle>
            <CardDescription>Your recent trading activity</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {trades.length > 0 ? (
            <motion.div
              className="space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {trades.map((trade, index) => (
                <motion.div
                  key={`${trade.symbol}-${trade.timestamp.getTime()}-${index}`}
                  variants={itemVariants}
                  whileHover="hover"
                  layout
                >
                  <Card className="p-4 border border-border/50 hover:border-primary/30 transition-colors duration-200 bg-gradient-to-r from-muted/10 to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          trade.type === 'buy' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {trade.type === 'buy' ? (
                            <TrendingUpIcon className="h-5 w-5" />
                          ) : (
                            <TrendingDownIcon className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">
                              {trade.type === 'buy' ? 'Bought' : 'Sold'} {trade.symbol}
                            </h3>
                            <Badge
                              variant={trade.type === 'buy' ? 'default' : 'secondary'}
                              className={`text-xs ${
                                trade.type === 'buy' 
                                  ? 'bg-green-100 text-green-700 border-green-200' 
                                  : 'bg-red-100 text-red-700 border-red-200'
                              }`}
                            >
                              {trade.type.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {trade.quantity} shares @ ${trade.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ${(trade.quantity * trade.price).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {trade.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-12"
              variants={emptyStateVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
                <FileTextIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No trading activity yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Start trading by selecting a stock and clicking Buy or Sell to see your transaction history here.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
