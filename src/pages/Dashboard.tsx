
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PriceChart from '@/components/dashboard/PriceChart';
import TradingPairs from '@/components/dashboard/TradingPairs';
import TradingWidget from '@/components/dashboard/TradingWidget';
import Statistics from '@/components/dashboard/Statistics';
import { useCryptoData } from '@/hooks/useCryptoData';
import { useAuth } from '@/context/AuthContext';
import { Bell, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { coins, isLoading, getPriceHistory } = useCryptoData();
  const [selectedCoin, setSelectedCoin] = useState<string>("bitcoin");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "BTC price alert",
      message: "Bitcoin just crossed $40,000!",
      time: "5 minutes ago",
      read: false
    },
    {
      id: 2,
      title: "ETH trade executed",
      message: "Your buy order for 0.5 ETH was completed.",
      time: "1 hour ago",
      read: true
    },
    {
      id: 3,
      title: "New feature available",
      message: "Grid trading strategy is now available.",
      time: "1 day ago",
      read: true
    }
  ]);
  
  // Redirect if not authenticated
  useEffect(() => {
    // For demo purposes, allow accessing the dashboard without authentication
    // In a real app, we would redirect: if (!isAuthenticated) navigate('/signin');
  }, [isAuthenticated, navigate]);
  
  const selectedCoinData = coins.find(coin => coin.id === selectedCoin);
  const priceHistory = getPriceHistory(selectedCoin);
  
  const handleSelectCoin = (coin: any) => {
    setSelectedCoin(coin.id);
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Layout>
      <div className="container p-6 pt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Button 
                variant="outline"
                size="icon"
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-lg border border-border z-10 overflow-hidden animate-fade-in">
                  <div className="p-3 border-b border-border flex justify-between items-center">
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        className="text-xs text-primary hover:underline"
                        onClick={markAllAsRead}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto subtle-scroll">
                    {notifications.length > 0 ? (
                      <div className="divide-y divide-border">
                        {notifications.map(notification => (
                          <div 
                            key={notification.id}
                            className={`p-3 hover:bg-secondary/50 ${notification.read ? 'opacity-70' : 'bg-secondary/20'}`}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-sm">{notification.title}</h4>
                              <span className="text-xs text-muted-foreground">{notification.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-center text-muted-foreground">
                        No notifications yet
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <Button variant="outline" className="hidden md:flex items-center gap-1">
              <Zap className="h-4 w-4 mr-1" />
              Auto Trading
              <span className="px-1.5 py-0.5 ml-2 text-xs rounded-full bg-green-500/20 text-green-500">Active</span>
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-pulse text-xl">Loading...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              {selectedCoinData && (
                <PriceChart 
                  data={priceHistory}
                  coin={selectedCoinData.name}
                  symbol={selectedCoinData.symbol.toUpperCase()}
                  currentPrice={selectedCoinData.current_price || 0}
                  priceChange={selectedCoinData.price_change_percentage_24h || 0}
                />
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Statistics />
                
                {selectedCoinData && (
                  <TradingWidget coin={selectedCoinData} />
                )}
              </div>
            </div>
            
            <div className="lg:col-span-4">
              <TradingPairs onSelect={handleSelectCoin} selectedCoin={selectedCoin} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
