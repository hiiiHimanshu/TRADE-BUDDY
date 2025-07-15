'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUpIcon } from 'lucide-react';

const pulseVariants = {
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const containerVariants = {
  visible: {
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

export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header skeleton */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"
            variants={pulseVariants}
            animate="pulse"
          >
            <TrendingUpIcon className="h-8 w-8 text-primary" />
          </motion.div>
          <h1 className="text-5xl font-bold gradient-text mb-2">
            STATUS ON WEBSITE
          </h1>
          <p className="text-xl text-muted-foreground">
            Loading market data...
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Market Overview Skeleton */}
          <motion.div className="lg:col-span-8 space-y-8" variants={itemVariants}>
            <Card className="border-2 border-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div>
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </div>
                
                {/* Table skeleton */}
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center justify-between p-4 border rounded-lg"
                      variants={itemVariants}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-16 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-4 w-16 mb-1 ml-auto" />
                        <Skeleton className="h-3 w-12 ml-auto" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chart Skeleton */}
            <Card className="h-96 border-2 border-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <motion.div
                  className="w-full h-64 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded-lg relative overflow-hidden"
                  variants={pulseVariants}
                  animate="pulse"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Dashboard Skeleton */}
          <motion.div className="lg:col-span-4 space-y-6" variants={itemVariants}>
            <Card className="border-2 border-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div>
                      <Skeleton className="h-5 w-20 mb-1" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
                
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="p-4 border rounded-lg"
                      variants={itemVariants}
                      transition={{ delay: i * 0.1 + 0.3 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-12 mb-1" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Skeleton className="h-8 w-12" />
                          <Skeleton className="h-8 w-12" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Skeleton */}
            <Card className="border-2 border-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div>
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="text-center py-8">
                  <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-5 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-48 mx-auto" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
