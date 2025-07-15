'use client';

import { Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Search, Star, Zap, Newspaper, BarChart3, Bell } from 'lucide-react';
import MarketOverview from '@/components/MarketOverview';
import TradingDashboard from '@/components/TradingDashboard';
import { StockChart } from '@/components/StockChart';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { StockSearch } from '@/components/StockSearch';
import { Watchlist } from '@/components/Watchlist';
import { QuickTradePanel } from '@/components/QuickTradePanel';
import { MarketNews } from '@/components/MarketNews';
import { PerformanceAnalytics } from '@/components/PerformanceAnalytics';
import { PriceAlerts } from '@/components/PriceAlerts';
import { MobileNavigation } from '@/components/MobileNavigation';
import { SessionAnalytics } from '@/components/SessionAnalytics';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingSkeleton = ({ className }: { className?: string }) => (
  <Card className={className}>
    <CardContent className="p-6">
      <Skeleton className="h-8 w-48 mb-4" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </CardContent>
  </Card>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
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
      damping: 24,
    },
  },
};

export default function Home() {
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <ConnectionStatus />
      <motion.div
        className="container mx-auto px-4 py-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-2">
                STATUS ON WEBSITE
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Real-time market data and advanced trading insights
              </p>
            </div>
            <MobileNavigation selectedTab={selectedTab} onTabChange={setSelectedTab} />
          </div>
          
          {/* Global Stock Search */}
          <div className="max-w-md">
            <StockSearch />
          </div>
        </motion.div>

        {/* Feature Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 lg:w-max">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="trading" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">Trading</span>
              </TabsTrigger>
              <TabsTrigger value="watchlist" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span className="hidden sm:inline">Watchlist</span>
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                <span className="hidden sm:inline">News</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Alerts</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                variants={containerVariants}
              >
                <motion.div className="lg:col-span-8 space-y-8" variants={itemVariants}>
                  <Suspense fallback={<LoadingSkeleton />}>
                    <MarketOverview />
                  </Suspense>
                  
                  <Suspense fallback={<LoadingSkeleton className="h-96" />}>
                    <StockChart />
                  </Suspense>
                </motion.div>
                
                <motion.div className="lg:col-span-4 space-y-6" variants={itemVariants}>
                  <Suspense fallback={<LoadingSkeleton />}>
                    <TradingDashboard />
                  </Suspense>
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* Trading Tab */}
            <TabsContent value="trading">
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                variants={containerVariants}
              >
                <motion.div className="lg:col-span-8 space-y-8" variants={itemVariants}>
                  <Suspense fallback={<LoadingSkeleton />}>
                    <MarketOverview />
                  </Suspense>
                  
                  <Suspense fallback={<LoadingSkeleton className="h-96" />}>
                    <StockChart />
                  </Suspense>
                </motion.div>
                
                <motion.div className="lg:col-span-4 space-y-6" variants={itemVariants}>
                  <QuickTradePanel />
                  <Suspense fallback={<LoadingSkeleton />}>
                    <TradingDashboard />
                  </Suspense>
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* Watchlist Tab */}
            <TabsContent value="watchlist">
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                variants={containerVariants}
              >
                <motion.div className="lg:col-span-8 space-y-8" variants={itemVariants}>
                  <Watchlist />
                  
                  <Suspense fallback={<LoadingSkeleton className="h-96" />}>
                    <StockChart />
                  </Suspense>
                </motion.div>
                
                <motion.div className="lg:col-span-4 space-y-6" variants={itemVariants}>
                  <QuickTradePanel />
                  <PriceAlerts />
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* News Tab */}
            <TabsContent value="news">
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                variants={containerVariants}
              >
                <motion.div className="lg:col-span-8 space-y-8" variants={itemVariants}>
                  <MarketNews />
                </motion.div>
                
                <motion.div className="lg:col-span-4 space-y-6" variants={itemVariants}>
                  <Suspense fallback={<LoadingSkeleton />}>
                    <MarketOverview />
                  </Suspense>
                  <QuickTradePanel />
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                variants={containerVariants}
              >
                <motion.div className="lg:col-span-8 space-y-8" variants={itemVariants}>
                  <PerformanceAnalytics />
                  
                  <Suspense fallback={<LoadingSkeleton className="h-96" />}>
                    <StockChart />
                  </Suspense>
                </motion.div>
                
                <motion.div className="lg:col-span-4 space-y-6" variants={itemVariants}>
                  <Suspense fallback={<LoadingSkeleton />}>
                    <TradingDashboard />
                  </Suspense>
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* Alerts Tab */}
            <TabsContent value="alerts">
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                variants={containerVariants}
              >
                <motion.div className="lg:col-span-8 space-y-8" variants={itemVariants}>
                  <PriceAlerts />
                  <Watchlist />
                </motion.div>
                
                <motion.div className="lg:col-span-4 space-y-6" variants={itemVariants}>
                  <QuickTradePanel />
                  <Suspense fallback={<LoadingSkeleton />}>
                    <MarketOverview />
                  </Suspense>
                </motion.div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        {/* Session Analytics - Development Only */}
        {process.env.NODE_ENV === 'development' && <SessionAnalytics />}
      </motion.div>
    </div>
  );
}
