'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus, X, TrendingUp, TrendingDown, AlertTriangle, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/lib/store';

interface PriceAlert {
  id: string;
  symbol: string;
  type: 'above' | 'below';
  targetPrice: number;
  currentPrice: number;
  isTriggered: boolean;
  createdAt: Date;
  triggeredAt?: Date;
}

export function PriceAlerts() {
  const { stocks } = useStore();
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: '1',
      symbol: 'AAPL',
      type: 'above',
      targetPrice: 180,
      currentPrice: 175.43,
      isTriggered: false,
      createdAt: new Date(),
    },
    {
      id: '2',
      symbol: 'TSLA',
      type: 'below',
      targetPrice: 240,
      currentPrice: 248.50,
      isTriggered: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      triggeredAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    type: 'above' as 'above' | 'below',
    targetPrice: '',
  });

  const activeAlerts = alerts.filter(alert => !alert.isTriggered);
  const triggeredAlerts = alerts.filter(alert => alert.isTriggered);

  const createAlert = () => {
    if (!newAlert.symbol || !newAlert.targetPrice) return;

    const stock = stocks.find(s => s.symbol === newAlert.symbol);
    if (!stock) return;

    const alert: PriceAlert = {
      id: Date.now().toString(),
      symbol: newAlert.symbol,
      type: newAlert.type,
      targetPrice: parseFloat(newAlert.targetPrice),
      currentPrice: stock.price,
      isTriggered: false,
      createdAt: new Date(),
    };

    setAlerts(prev => [...prev, alert]);
    setNewAlert({ symbol: '', type: 'above', targetPrice: '' });
    setShowCreateForm(false);
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getAlertStatus = (alert: PriceAlert) => {
    const stock = stocks.find(s => s.symbol === alert.symbol);
    if (!stock) return 'unknown';

    if (alert.type === 'above' && stock.price >= alert.targetPrice) {
      return 'triggered';
    }
    if (alert.type === 'below' && stock.price <= alert.targetPrice) {
      return 'triggered';
    }
    return 'active';
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
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <Card className="border-2 border-primary/10">
      <CardHeader className="bg-gradient-to-r from-muted/30 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Price Alerts
                {activeAlerts.length > 0 && (
                  <Badge variant="secondary">{activeAlerts.length}</Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">Get notified when prices hit your targets</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Alert
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Create Alert Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-muted/20 rounded-lg border border-border/50 space-y-4"
            >
              <h4 className="font-semibold">Create New Alert</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Stock Symbol</Label>
                  <Select value={newAlert.symbol} onValueChange={(value) => setNewAlert(prev => ({ ...prev, symbol: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stock" />
                    </SelectTrigger>
                    <SelectContent>
                      {stocks.map(stock => (
                        <SelectItem key={stock.symbol} value={stock.symbol}>
                          {stock.symbol} - ${stock.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Alert Type</Label>
                  <Select value={newAlert.type} onValueChange={(value: 'above' | 'below') => setNewAlert(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Price Above</SelectItem>
                      <SelectItem value="below">Price Below</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Target Price</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newAlert.targetPrice}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, targetPrice: e.target.value }))}
                    step="0.01"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
                <Button onClick={createAlert} disabled={!newAlert.symbol || !newAlert.targetPrice}>
                  Create Alert
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
              Active Alerts ({activeAlerts.length})
            </h4>
            
            <motion.div
              className="space-y-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {activeAlerts.map((alert) => {
                  const stock = stocks.find(s => s.symbol === alert.symbol);
                  const status = getAlertStatus(alert);
                  
                  return (
                    <motion.div
                      key={alert.id}
                      variants={itemVariants}
                      exit="exit"
                      layout
                    >
                      <Card className={`p-4 border transition-colors duration-200 ${
                        status === 'triggered' 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-border/50 hover:border-primary/30'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-bold">{alert.symbol.charAt(0)}</span>
                            </div>
                            
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold">{alert.symbol}</span>
                                <Badge variant={alert.type === 'above' ? 'default' : 'secondary'} className="text-xs">
                                  {alert.type === 'above' ? (
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                  ) : (
                                    <TrendingDown className="h-3 w-3 mr-1" />
                                  )}
                                  {alert.type} ${alert.targetPrice.toFixed(2)}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Current: ${stock?.price.toFixed(2) || 'N/A'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {status === 'triggered' && (
                              <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                                <Check className="h-3 w-3 mr-1" />
                                Triggered
                              </Badge>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteAlert(alert.id)}
                              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

        {/* Triggered Alerts */}
        {triggeredAlerts.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center">
              <Check className="h-4 w-4 mr-2 text-green-500" />
              Recent Triggers ({triggeredAlerts.length})
            </h4>
            
            <motion.div className="space-y-2" variants={containerVariants}>
              {triggeredAlerts.slice(0, 3).map((alert) => (
                <motion.div key={alert.id} variants={itemVariants}>
                  <Card className="p-3 border border-green-200 bg-green-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800">
                          {alert.symbol} {alert.type} ${alert.targetPrice.toFixed(2)}
                        </span>
                      </div>
                      <span className="text-xs text-green-600">
                        {alert.triggeredAt?.toLocaleTimeString()}
                      </span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Empty State */}
        {alerts.length === 0 && (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No alerts set</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create price alerts to get notified when stocks reach your target prices.
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Alert
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
