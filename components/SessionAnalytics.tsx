'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Clock, 
  MousePointer, 
  Eye, 
  Target,
  Zap,
  TrendingUp,
  Users
} from 'lucide-react';

interface SessionMetrics {
  startTime: number;
  pageViews: number;
  clickCount: number;
  activeTime: number;
  featuresUsed: string[];
}

export function SessionAnalytics() {
  const [metrics, setMetrics] = useState<SessionMetrics>({
    startTime: Date.now(),
    pageViews: 1,
    clickCount: 0,
    activeTime: 0,
    featuresUsed: [],
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeTime: prev.activeTime + 1,
      }));
    }, 1000);

    const handleClick = () => {
      setMetrics(prev => ({
        ...prev,
        clickCount: prev.clickCount + 1,
      }));
    };

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Track feature usage
    const trackFeatureUsage = (feature: string) => {
      setMetrics(prev => {
        const updatedFeatures = prev.featuresUsed.includes(feature) 
          ? prev.featuresUsed 
          : [...prev.featuresUsed, feature];
        return {
          ...prev,
          featuresUsed: updatedFeatures,
        };
      });
    };

    // Simulate feature tracking
    const features = ['stock-search', 'watchlist', 'trading', 'analytics', 'news'];
    const featureTimer = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomFeature = features[Math.floor(Math.random() * features.length)];
        trackFeatureUsage(randomFeature);
      }
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(featureTimer);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const engagementScore = Math.min(
    100,
    (metrics.clickCount * 2 + metrics.featuresUsed.length * 10 + Math.min(metrics.activeTime / 10, 30))
  );

  return (
    <Card className="w-full max-w-sm fixed bottom-4 right-4 z-50 shadow-lg border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Session Metrics
          </CardTitle>
          <Badge variant={isVisible ? "default" : "secondary"} className="text-xs">
            {isVisible ? "Active" : "Away"}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Real-time engagement analytics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Time Metrics */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-blue-500" />
            <div>
              <p className="font-medium">{formatTime(metrics.activeTime)}</p>
              <p className="text-muted-foreground">Active Time</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MousePointer className="h-3 w-3 text-green-500" />
            <div>
              <p className="font-medium">{metrics.clickCount}</p>
              <p className="text-muted-foreground">Interactions</p>
            </div>
          </div>
        </div>

        {/* Engagement Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              <Target className="h-3 w-3 text-orange-500" />
              Engagement
            </span>
            <span className="font-medium">{Math.round(engagementScore)}%</span>
          </div>
          <Progress value={engagementScore} className="h-2" />
        </div>

        {/* Features Used */}
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-xs">
            <Zap className="h-3 w-3 text-purple-500" />
            <span>Features Used ({metrics.featuresUsed.length})</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {metrics.featuresUsed.slice(0, 4).map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Badge variant="outline" className="text-xs px-1 py-0">
                  {feature.replace('-', ' ')}
                </Badge>
              </motion.div>
            ))}
            {metrics.featuresUsed.length > 4 && (
              <Badge variant="secondary" className="text-xs px-1 py-0">
                +{metrics.featuresUsed.length - 4}
              </Badge>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {metrics.pageViews} views
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            Live session
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
