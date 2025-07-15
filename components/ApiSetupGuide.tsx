'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLinkIcon, KeyIcon, InfoIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function ApiSetupGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <KeyIcon className="h-4 w-4 mr-2" />
          API Setup
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <KeyIcon className="h-5 w-5 mr-2" />
            Real-Time Stock API Setup
          </DialogTitle>
          <DialogDescription>
            Get your own free API keys to access real-time stock market data
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              The app currently uses demo/sandbox API keys. For production use and higher rate limits, 
              get your own free API keys from the providers below.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Finnhub (Recommended)</CardTitle>
                <CardDescription>
                  Free tier: 60 API calls per minute • Real-time stock prices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium">Steps:</p>
                  <ol className="list-decimal list-inside space-y-1 mt-2 text-muted-foreground">
                    <li>Sign up for a free account at Finnhub.io</li>
                    <li>Get your API key from the dashboard</li>
                    <li>Add it to your .env.local file as NEXT_PUBLIC_FINNHUB_API_KEY</li>
                    <li>Restart your development server</li>
                  </ol>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://finnhub.io" target="_blank" rel="noopener noreferrer">
                    <ExternalLinkIcon className="h-4 w-4 mr-2" />
                    Get Finnhub API Key
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alpha Vantage (Backup)</CardTitle>
                <CardDescription>
                  Free tier: 5 API calls per minute • Stock data and more
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium">Steps:</p>
                  <ol className="list-decimal list-inside space-y-1 mt-2 text-muted-foreground">
                    <li>Visit Alpha Vantage and request a free API key</li>
                    <li>Check your email for the API key</li>
                    <li>Add it to your .env.local file as NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY</li>
                    <li>The app will use this as a fallback option</li>
                  </ol>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.alphavantage.co/support/#api-key" target="_blank" rel="noopener noreferrer">
                    <ExternalLinkIcon className="h-4 w-4 mr-2" />
                    Get Alpha Vantage API Key
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Example .env.local file:</h4>
            <pre className="text-sm text-muted-foreground bg-background p-3 rounded border">
{`# Add these to your .env.local file
NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_api_key_here
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
NEXT_PUBLIC_FORCE_MOCK_DATA=false`}
            </pre>
          </div>

          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>Rate Limits:</strong> Free API keys have call limits. The app automatically 
              falls back to demo data if rate limits are exceeded.
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
}
