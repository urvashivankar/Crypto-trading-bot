
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCryptoData } from '@/hooks/useCryptoData';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TradingPairsProps {
  onSelect: (coin: any) => void;
  selectedCoin: string;
}

export default function TradingPairs({ onSelect, selectedCoin }: TradingPairsProps) {
  const { coins, isLoading } = useCryptoData();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredCoins = coins.filter(coin => 
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Card className="shadow-sm h-full animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-medium">Trading Pairs</CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search coins..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-y-auto max-h-[370px] pr-2 subtle-scroll">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse h-6 w-24 bg-muted rounded"></div>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredCoins.map((coin) => (
                <div
                  key={coin.id}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedCoin === coin.id
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-secondary'
                  }`}
                  onClick={() => onSelect(coin)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold">{coin.symbol.substring(0, 3)}</span>
                    </div>
                    <div>
                      <div className="font-medium">{coin.name}</div>
                      <div className="text-xs text-muted-foreground">{coin.symbol.toUpperCase()}/USDT</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      ${coin.current_price?.toLocaleString(undefined, {
                        minimumFractionDigits: coin.current_price < 1 ? 4 : 2,
                        maximumFractionDigits: coin.current_price < 1 ? 6 : 2,
                      })}
                    </div>
                    <div
                      className={`text-xs ${
                        (coin.price_change_percentage_24h || 0) >= 0
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {(coin.price_change_percentage_24h || 0) >= 0 ? '+' : ''}
                      {(coin.price_change_percentage_24h || 0).toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredCoins.length === 0 && (
                <div className="py-4 text-center text-muted-foreground">
                  No coins found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
