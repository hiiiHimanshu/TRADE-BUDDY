'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  BarChart3, 
  Zap, 
  Star, 
  Newspaper, 
  Bell,
  TrendingUp,
  DollarSign,
  Activity
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MobileNavigationProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems = [
  {
    id: 'overview',
    label: 'Market Overview',
    icon: BarChart3,
    description: 'Real-time market data and trends',
    color: 'text-blue-500',
  },
  {
    id: 'trading',
    label: 'Quick Trading',
    icon: Zap,
    description: 'Fast buy/sell interface',
    color: 'text-green-500',
  },
  {
    id: 'watchlist',
    label: 'My Watchlist',
    icon: Star,
    description: 'Track your favorite stocks',
    color: 'text-yellow-500',
    badge: '12',
  },
  {
    id: 'news',
    label: 'Market News',
    icon: Newspaper,
    description: 'Latest financial news',
    color: 'text-purple-500',
    badge: 'New',
  },
  {
    id: 'analytics',
    label: 'Performance',
    icon: TrendingUp,
    description: 'Trading analytics & insights',
    color: 'text-orange-500',
  },
  {
    id: 'alerts',
    label: 'Price Alerts',
    icon: Bell,
    description: 'Manage your price alerts',
    color: 'text-red-500',
    badge: '3',
  },
];

export function MobileNavigation({ selectedTab, onTabChange }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTabSelect = (tab: string) => {
    onTabChange(tab);
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Open navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">STATUS ON WEBSITE</h2>
                  <p className="text-sm text-muted-foreground">Trading Dashboard</p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 p-4 space-y-2">
              <AnimatePresence>
                {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = selectedTab === item.id;
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={`w-full justify-start h-auto p-4 ${
                          isActive ? 'bg-primary/10 border-primary/20' : ''
                        }`}
                        onClick={() => handleTabSelect(item.id)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <Icon className={`h-5 w-5 ${item.color}`} />
                          <div className="flex-1 text-left">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{item.label}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Market is Open</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
