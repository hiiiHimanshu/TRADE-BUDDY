'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { AlertCircle, Wifi, WifiOff, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ConnectionStatus() {
  const { isConnected, setConnectionStatus } = useStore();
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const checkConnection = () => {
      const online = navigator.onLine;
      
      // If coming back online, show reconnected message
      if (online && !isConnected) {
        setShowReconnected(true);
        setTimeout(() => setShowReconnected(false), 3000);
      }
      
      setConnectionStatus(online);
    };

    // Initial check
    checkConnection();

    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);

    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
    };
  }, [setConnectionStatus, isConnected]);

  return (
    <AnimatePresence>
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4"
        >
          <Alert variant="destructive" className="w-max border-2 shadow-lg backdrop-blur-sm bg-destructive/95">
            <WifiOff className="h-4 w-4 animate-pulse" />
            <AlertDescription className="flex items-center font-medium">
              Connection lost. Attempting to reconnect...
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
      
      {showReconnected && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4"
        >
          <Alert className="w-max border-2 border-green-200 bg-green-50 text-green-800 shadow-lg backdrop-blur-sm">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="flex items-center font-medium">
              <Wifi className="h-4 w-4 mr-2" />
              Connection restored!
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
