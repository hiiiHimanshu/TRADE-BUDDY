'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartTypeSelector } from '@/components/ChartTypeSelector';
import { StockSelector } from '@/components/StockSelector';
import { ChartContent } from '@/components/ChartContent';
import { Switch } from '@/components/ui/switch';

type ChartType = 'line' | 'area' | 'bar';

interface PriceData {
  [key: string]: number | string;
  time: string;
}

export function StockChart() {
  const { stocks } = useStore();
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);
  const [chartType, setChartType] = useState<ChartType>('line');
  const [showPercentages, setShowPercentages] = useState(true);

  useEffect(() => {
    if (stocks.length > 0 && selectedStocks.length === 0) {
      setSelectedStocks([stocks[0].symbol]);
    }
  }, [stocks, selectedStocks.length]);

  useEffect(() => {
    // Only update if we have selected stocks
    if (selectedStocks.length === 0) return;

    const selectedStockData = stocks.filter((s) =>
      selectedStocks.includes(s.symbol)
    );

    setPriceHistory((prev) => {
      const newPoint: PriceData = {
        time: new Date().toLocaleTimeString(),
      };

      selectedStockData.forEach((stock) => {
        newPoint[stock.symbol] = stock.price;
      });

      const updatedHistory = [...prev, newPoint].slice(-20);
      return updatedHistory;
    });
  }, [stocks, selectedStocks]);

  return (
    <Card>
      <CardHeader className="space-y-3 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-normal">Price Chart</CardTitle>
          <ChartTypeSelector activeType={chartType} onChange={setChartType} />
        </div>
        <div className="flex justify-between flex-wrap items-center gap-4">
          <StockSelector
            stocks={stocks}
            selectedStocks={selectedStocks}
            onSelect={setSelectedStocks}
          />
          <div className="flex items-center space-x-2">
            <Switch
              checked={showPercentages}
              onCheckedChange={setShowPercentages}
              id="percentage-mode"
            />
            <label
              htmlFor="percentage-mode"
              className="text-sm text-muted-foreground whitespace-nowrap"
            >
              Show percentages
            </label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {selectedStocks.length > 0 && (
            <ChartContent
              data={priceHistory}
              type={chartType}
              dataKeys={selectedStocks}
              showPercentages={showPercentages}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
