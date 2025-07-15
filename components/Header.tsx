'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AuthModal } from '@/components/AuthModal';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  UserIcon, 
  LogOutIcon, 
  TrendingUpIcon,
  WalletIcon
} from 'lucide-react';

export function Header() {
  const { user, setUser } = useStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('statusOnWebsiteToken');
    setUser(null);
  };

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-xl font-bold hover:text-primary transition-colors group"
          >
            <motion.div
              className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <TrendingUpIcon className="h-5 w-5 text-primary" />
            </motion.div>
            <span className="gradient-text">STATUS ON WEBSITE</span>
          </Link>
        </motion.div>
        
        <motion.div 
          className="flex items-center space-x-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {user ? (
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex items-center space-x-2 bg-muted/50 rounded-lg px-3 py-2">
                <WalletIcon className="h-4 w-4 text-muted-foreground" />
                <Badge variant="secondary" className="bg-primary/10 text-primary font-bold">
                  ${user.balance.toFixed(2)}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2 bg-muted/50 rounded-lg px-3 py-2">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {user.email.split('@')[0]}
                </span>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
              >
                <LogOutIcon className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </motion.div>
          ) : (
            <Button 
              onClick={() => setShowAuthModal(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <UserIcon className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}
          <ThemeToggle />
        </motion.div>
      </div>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </motion.header>
  );
}
