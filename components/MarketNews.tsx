'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, TrendingUp, Globe, Clock, ExternalLink, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: Date;
  sentiment: 'positive' | 'negative' | 'neutral';
  category: 'market' | 'company' | 'economy' | 'crypto';
  url: string;
  impact: 'high' | 'medium' | 'low';
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Tech Stocks Rally as AI Innovation Continues',
    summary: 'Major technology companies see significant gains following breakthrough AI announcements.',
    source: 'Market Watch',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    sentiment: 'positive',
    category: 'market',
    url: '#',
    impact: 'high',
  },
  {
    id: '2',
    title: 'Federal Reserve Signals Potential Rate Changes',
    summary: 'Central bank officials discuss monetary policy adjustments in upcoming meetings.',
    source: 'Financial Times',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    sentiment: 'neutral',
    category: 'economy',
    url: '#',
    impact: 'high',
  },
  {
    id: '3',
    title: 'Apple Reports Strong Quarterly Earnings',
    summary: 'iPhone maker exceeds analyst expectations with robust sales across all product lines.',
    source: 'Reuters',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    sentiment: 'positive',
    category: 'company',
    url: '#',
    impact: 'medium',
  },
  {
    id: '4',
    title: 'Energy Sector Faces Volatility Amid Global Events',
    summary: 'Oil and gas stocks experience mixed trading as geopolitical tensions affect markets.',
    source: 'Bloomberg',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    sentiment: 'negative',
    category: 'market',
    url: '#',
    impact: 'medium',
  },
];

export function MarketNews() {
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const refreshNews = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would fetch from a news API
    const shuffled = [...mockNews].sort(() => Math.random() - 0.5);
    setNews(shuffled);
    setIsLoading(false);
  };

  const filteredNews = filter === 'all' 
    ? news 
    : news.filter(item => item.impact === filter);

  const getSentimentColor = (sentiment: NewsItem['sentiment']) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100 border-green-200';
      case 'negative': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-blue-600 bg-blue-100 border-blue-200';
    }
  };

  const getImpactColor = (impact: NewsItem['impact']) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getCategoryIcon = (category: NewsItem['category']) => {
    switch (category) {
      case 'market': return <TrendingUp className="h-3 w-3" />;
      case 'company': return <Globe className="h-3 w-3" />;
      case 'economy': return <Newspaper className="h-3 w-3" />;
      default: return <Globe className="h-3 w-3" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    return `${diffInHours} hours ago`;
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

  return (
    <Card className="border-2 border-primary/10">
      <CardHeader className="bg-gradient-to-r from-muted/30 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Newspaper className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Market News</CardTitle>
              <p className="text-sm text-muted-foreground">Latest financial updates</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Filter buttons */}
            <div className="flex space-x-1">
              {(['all', 'high', 'medium', 'low'] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className="h-7 text-xs capitalize"
                >
                  {f === 'all' ? 'All' : `${f} Impact`}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={refreshNews}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredNews.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover="hover"
                layout
                className="group"
              >
                <Card className="p-4 border border-border/50 hover:border-primary/30 transition-colors duration-200 cursor-pointer bg-gradient-to-r from-muted/5 to-transparent">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={`text-xs ${getSentimentColor(item.sentiment)}`}>
                          {item.sentiment}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getImpactColor(item.impact)}`}>
                          {item.impact} impact
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {getCategoryIcon(item.category)}
                          <span className="ml-1 capitalize">{item.category}</span>
                        </Badge>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.summary}
                    </p>

                    <Separator />

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-3 w-3" />
                        <span className="font-medium">{item.source}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeAgo(item.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredNews.length === 0 && (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Newspaper className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No news found for the selected filter.</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
