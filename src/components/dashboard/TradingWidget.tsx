
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowUpDown, Zap } from 'lucide-react';

interface TradingWidgetProps {
  coin: {
    id: string;
    name: string;
    symbol: string;
    current_price?: number;
  };
}

export default function TradingWidget({ coin }: TradingWidgetProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [tradingType, setTradingType] = useState('manual');
  const [manualAction, setManualAction] = useState('buy');
  const [takeProfitPrice, setTakeProfitPrice] = useState('');
  const [stopLossPrice, setStopLossPrice] = useState('');
  const [leverageValue, setLeverageValue] = useState([1]);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState('market-making');
  
  const tradingStrategies = [
    { id: 'market-making', name: 'Market Making' },
    { id: 'scalping', name: 'Scalping' },
    { id: 'trend-following', name: 'Trend Following' },
    { id: 'grid-trading', name: 'Grid Trading' },
  ];

  const handleTrade = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount.',
        variant: 'destructive',
      });
      return;
    }

    // In a real app, this would make an API call to execute the trade
    toast({
      title: `${manualAction === 'buy' ? 'Buy' : 'Sell'} Order Placed`,
      description: `Successfully placed a ${manualAction} order for ${amount} ${coin.symbol.toUpperCase()} at $${coin.current_price?.toLocaleString()}`,
    });
  };

  const handleAutomatedTrade = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Automated Trading Started',
      description: `Successfully started automated trading for ${amount} ${coin.symbol.toUpperCase()} using ${
        tradingStrategies.find(s => s.id === selectedStrategy)?.name
      } strategy.`,
    });
  };

  return (
    <Card className="shadow-sm animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-medium">Trade {coin.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual" onValueChange={setTradingType}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="manual">Manual Trading</TabsTrigger>
            <TabsTrigger value="automated">Automated Trading</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-4">
            <div className="flex space-x-4 border border-border rounded-lg p-1">
              <Button
                variant={manualAction === 'buy' ? 'default' : 'outline'}
                className={`flex-1 ${manualAction === 'buy' ? '' : 'border-muted'}`}
                onClick={() => setManualAction('buy')}
              >
                Buy
              </Button>
              <Button
                variant={manualAction === 'sell' ? 'default' : 'outline'}
                className={`flex-1 ${manualAction === 'sell' ? '' : 'border-muted'}`}
                onClick={() => setManualAction('sell')}
              >
                Sell
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label>Amount ({coin.symbol.toUpperCase()})</Label>
              <Input
                type="number"
                placeholder={`Enter amount in ${coin.symbol.toUpperCase()}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Est. Price: ${coin.current_price?.toLocaleString()}</span>
                <span>
                  Est. Total: $
                  {amount && coin.current_price
                    ? (parseFloat(amount) * coin.current_price).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : '0.00'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-4">
              <Switch
                id="advanced-mode"
                checked={isAdvancedMode}
                onCheckedChange={setIsAdvancedMode}
              />
              <Label htmlFor="advanced-mode">Advanced Mode</Label>
            </div>
            
            {isAdvancedMode && (
              <div className="space-y-4 mt-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  <Label>Take Profit Price</Label>
                  <Input 
                    type="number"
                    placeholder="Enter take profit price"
                    value={takeProfitPrice}
                    onChange={(e) => setTakeProfitPrice(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Stop Loss Price</Label>
                  <Input 
                    type="number"
                    placeholder="Enter stop loss price"
                    value={stopLossPrice}
                    onChange={(e) => setStopLossPrice(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Leverage</Label>
                    <span className="text-sm font-medium">{leverageValue[0]}x</span>
                  </div>
                  <Slider
                    value={leverageValue}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={setLeverageValue}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1x</span>
                    <span>10x</span>
                  </div>
                </div>
              </div>
            )}
            
            <Button
              className="w-full mt-2 btn-hover"
              onClick={handleTrade}
              variant={manualAction === 'buy' ? 'default' : 'destructive'}
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              {manualAction === 'buy' ? 'Buy' : 'Sell'} {coin.symbol.toUpperCase()}
            </Button>
          </TabsContent>
          
          <TabsContent value="automated" className="space-y-4">
            <div className="space-y-2">
              <Label>Trading Strategy</Label>
              <Select
                value={selectedStrategy}
                onValueChange={setSelectedStrategy}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a strategy" />
                </SelectTrigger>
                <SelectContent>
                  {tradingStrategies.map((strategy) => (
                    <SelectItem key={strategy.id} value={strategy.id}>
                      {strategy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Trading Amount ({coin.symbol.toUpperCase()})</Label>
              <Input
                type="number"
                placeholder={`Enter amount in ${coin.symbol.toUpperCase()}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Take Profit (%)</Label>
              <Input
                type="number"
                placeholder="Enter take profit percentage"
                defaultValue="2"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Stop Loss (%)</Label>
              <Input
                type="number"
                placeholder="Enter stop loss percentage"
                defaultValue="1"
              />
            </div>
            
            <div className="pt-2">
              <Button 
                className="w-full btn-hover"
                onClick={handleAutomatedTrade}
              >
                <Zap className="h-4 w-4 mr-2" />
                Start Automated Trading
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
