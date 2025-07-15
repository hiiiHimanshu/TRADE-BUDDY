'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, TrendingUp, TrendingDown, DollarSign, Calculator, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/lib/store';
import { Stock } from '@/lib/types';

interface QuickTradePanelProps {
  selectedStock?: Stock;
}

export function QuickTradePanel({ selectedStock }: QuickTradePanelProps) {
  const { stocks, user, addTrade } = useStore();
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentStock = selectedStock || stocks[0];
  const totalCost = parseFloat(quantity) * currentStock.price;
  const isValidTrade = quantity && parseFloat(quantity) > 0 && user && totalCost <= user.balance;

  const handleQuickTrade = async () => {
    if (!isValidTrade || !user) return;

    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const trade = {
      symbol: currentStock.symbol,
      type: tradeType,
      quantity: parseInt(quantity),
      price: orderType === 'market' ? currentStock.price : parseFloat(limitPrice),
      timestamp: new Date(),
    };

    addTrade(trade);
    setIsProcessing(false);
    setShowSuccess(true);
    setQuantity('');
    setLimitPrice('');

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const containerVariants = {
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
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-card/50">
        <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Quick Trade</CardTitle>
                <p className="text-sm text-muted-foreground">Lightning-fast trading</p>
              </div>
            </div>
            <Badge variant="secondary" className="animate-pulse">
              Live
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Stock Selection */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-bold text-sm">{currentStock.symbol.charAt(0)}</span>
              </div>
              <div>
                <h3 className="font-semibold">{currentStock.symbol}</h3>
                <p className="text-sm text-muted-foreground">{currentStock.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${currentStock.price.toFixed(2)}</p>
              <div className={`text-sm flex items-center ${
                currentStock.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {currentStock.percentageChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {currentStock.percentageChange >= 0 ? '+' : ''}{currentStock.percentageChange.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Trade Type Toggle */}
          <div className="flex space-x-2 p-1 bg-muted/30 rounded-lg">
            <Button
              variant={tradeType === 'buy' ? 'default' : 'ghost'}
              onClick={() => setTradeType('buy')}
              className={`flex-1 ${tradeType === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'hover:bg-green-50 hover:text-green-700'}`}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Buy
            </Button>
            <Button
              variant={tradeType === 'sell' ? 'default' : 'ghost'}
              onClick={() => setTradeType('sell')}
              className={`flex-1 ${tradeType === 'sell' ? 'bg-red-500 hover:bg-red-600' : 'hover:bg-red-50 hover:text-red-700'}`}
            >
              <TrendingDown className="h-4 w-4 mr-2" />
              Sell
            </Button>
          </div>

          {/* Order Type */}
          <div className="space-y-3">
            <Label htmlFor="orderType">Order Type</Label>
            <Select value={orderType} onValueChange={(value: 'market' | 'limit') => setOrderType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market Order</SelectItem>
                <SelectItem value="limit">Limit Order</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity Input */}
          <div className="space-y-3">
            <Label htmlFor="quantity">Quantity</Label>
            <div className="relative">
              <Input
                id="quantity"
                type="number"
                placeholder="Enter shares"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="pr-16"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                shares
              </div>
            </div>
          </div>

          {/* Limit Price (if limit order) */}
          <AnimatePresence>
            {orderType === 'limit' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <Label htmlFor="limitPrice">Limit Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="limitPrice"
                    type="number"
                    placeholder="0.00"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    className="pl-10"
                    step="0.01"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Order Summary */}
          {quantity && parseFloat(quantity) > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-muted/20 rounded-lg border border-border/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Order Summary</span>
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </div>
              <Separator className="mb-3" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Shares</span>
                  <span className="font-medium">{quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per share</span>
                  <span className="font-medium">
                    ${orderType === 'market' ? currentStock.price.toFixed(2) : limitPrice || '0.00'}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>${totalCost.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* User Balance */}
          {user && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Available Balance</span>
              <span className="font-semibold">${user.balance.toFixed(2)}</span>
            </div>
          )}

          {/* Execute Trade Button */}
          <Button
            onClick={handleQuickTrade}
            disabled={!isValidTrade || isProcessing}
            className={`w-full h-12 text-base font-semibold ${
              tradeType === 'buy' 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${quantity || '0'} Shares`
            )}
          </Button>

          {/* Success Message */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                variants={successVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3"
              >
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">Trade Executed!</p>
                  <p className="text-sm text-green-600">
                    {tradeType === 'buy' ? 'Bought' : 'Sold'} {quantity} shares of {currentStock.symbol}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
