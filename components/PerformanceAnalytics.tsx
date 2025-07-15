'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Target, Award, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/lib/store';

interface PerformanceMetric {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export function PerformanceAnalytics() {
  const { user, trades } = useStore();

  if (!user || trades.length === 0) {
    return (
      <Card className="border-2 border-primary/10">
        <CardHeader className="bg-gradient-to-r from-muted/30 to-transparent">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Performance Analytics</CardTitle>
              <p className="text-sm text-muted-foreground">Track your trading performance</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Start trading to see your performance metrics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate metrics
  const totalTrades = trades.length;
  const buyTrades = trades.filter(t => t.type === 'buy').length;
  const sellTrades = trades.filter(t => t.type === 'sell').length;
  const totalVolume = trades.reduce((sum, trade) => sum + (trade.quantity * trade.price), 0);
  const avgTradeSize = totalVolume / totalTrades;
  
  // Calculate win rate (simplified - in real app would track P&L per trade)
  const winRate = Math.random() * 30 + 55; // Mock win rate between 55-85%
  const totalReturn = Math.random() * 20 - 5; // Mock return between -5% to 15%
  
  const metrics: PerformanceMetric[] = [
    {
      label: 'Total Return',
      value: `${totalReturn >= 0 ? '+' : ''}${totalReturn.toFixed(2)}%`,
      change: totalReturn,
      icon: <TrendingUp className="h-4 w-4" />,
      color: totalReturn >= 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      label: 'Win Rate',
      value: `${winRate.toFixed(1)}%`,
      change: winRate - 60, // vs 60% benchmark
      icon: <Target className="h-4 w-4" />,
      color: winRate >= 60 ? 'text-green-600' : 'text-red-600',
    },
    {
      label: 'Total Trades',
      value: totalTrades,
      change: totalTrades > 10 ? 5 : -2,
      icon: <BarChart3 className="h-4 w-4" />,
      color: 'text-blue-600',
    },
    {
      label: 'Avg Trade Size',
      value: `$${avgTradeSize.toFixed(0)}`,
      change: 12,
      icon: <DollarSign className="h-4 w-4" />,
      color: 'text-purple-600',
    },
  ];

  const tradingStreak = Math.floor(Math.random() * 7) + 1;
  const monthlyGoal = 15; // 15% monthly target
  const currentProgress = Math.min((Math.abs(totalReturn) / monthlyGoal) * 100, 100);

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
  };

  return (
    <Card className="border-2 border-primary/10">
      <CardHeader className="bg-gradient-to-r from-muted/30 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Performance Analytics</CardTitle>
              <p className="text-sm text-muted-foreground">Your trading insights</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="animate-pulse">
              <Calendar className="h-3 w-3 mr-1" />
              This Month
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Key Metrics Grid */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={itemVariants}
          >
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                className="p-4 bg-gradient-to-br from-muted/20 to-muted/5 rounded-lg border border-border/50"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-primary/10 ${metric.color}`}>
                    {metric.icon}
                  </div>
                  <div className={`text-xs flex items-center ${
                    metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(1)}%
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                <p className={`text-lg font-bold ${metric.color}`}>{metric.value}</p>
              </motion.div>
            ))}
          </motion.div>

          <Separator />

          {/* Monthly Goal Progress */}
          <motion.div variants={itemVariants} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold flex items-center">
                <Target className="h-4 w-4 mr-2 text-primary" />
                Monthly Goal Progress
              </h4>
              <Badge variant="outline">
                {currentProgress.toFixed(0)}% Complete
              </Badge>
            </div>
            
            <Progress value={currentProgress} className="h-3" />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Target: {monthlyGoal}% Return</span>
              <span>Current: {Math.abs(totalReturn).toFixed(1)}%</span>
            </div>
          </motion.div>

          <Separator />

          {/* Trading Activity Summary */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="font-semibold flex items-center">
              <Award className="h-4 w-4 mr-2 text-primary" />
              Trading Summary
            </h4>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-2xl font-bold text-green-600">{buyTrades}</p>
                <p className="text-xs text-green-700">Buy Orders</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-2xl font-bold text-red-600">{sellTrades}</p>
                <p className="text-xs text-red-700">Sell Orders</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-2xl font-bold text-blue-600">{tradingStreak}</p>
                <p className="text-xs text-blue-700">Day Streak</p>
              </div>
            </div>
          </motion.div>

          {/* Achievement Badges */}
          <motion.div variants={itemVariants} className="space-y-3">
            <h4 className="font-semibold text-sm">Recent Achievements</h4>
            <div className="flex flex-wrap gap-2">
              {totalTrades >= 5 && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  🏆 Active Trader
                </Badge>
              )}
              {winRate >= 70 && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  🎯 Sharp Shooter
                </Badge>
              )}
              {tradingStreak >= 3 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                  🔥 On Fire
                </Badge>
              )}
              {totalReturn >= 10 && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
                  💎 Diamond Hands
                </Badge>
              )}
            </div>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
