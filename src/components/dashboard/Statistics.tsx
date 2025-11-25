
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/context/ThemeContext';
import { ArrowUpRight, ArrowDownRight, DollarSign, Percent, TrendingUp } from 'lucide-react';

// Mock trading history data
const mockTradingData = [
  { day: 'Mon', profit: 120 },
  { day: 'Tue', profit: -50 },
  { day: 'Wed', profit: 80 },
  { day: 'Thu', profit: 200 },
  { day: 'Fri', profit: -80 },
  { day: 'Sat', profit: 110 },
  { day: 'Sun', profit: 40 },
];

// Calculate total profit from mock data
const totalProfit = mockTradingData.reduce((acc, item) => acc + item.profit, 0);
const winningTrades = mockTradingData.filter(item => item.profit > 0).length;
const winRate = (winningTrades / mockTradingData.length) * 100;

export default function Statistics() {
  const { theme } = useTheme();
  
  return (
    <Card className="shadow-sm animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-medium">Trading Performance</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-secondary/50 rounded-lg p-4 transition-transform hover:translate-y-[-2px]">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Weekly P&L</span>
                <span className="text-2xl font-semibold">${totalProfit.toFixed(2)}</span>
              </div>
              <div className={`p-2 rounded-full ${totalProfit >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                {totalProfit >= 0 ? (
                  <ArrowUpRight className="h-5 w-5 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-secondary/50 rounded-lg p-4 transition-transform hover:translate-y-[-2px]">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Win Rate</span>
                <span className="text-2xl font-semibold">{winRate.toFixed(1)}%</span>
              </div>
              <div className="p-2 rounded-full bg-primary/10">
                <Percent className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="bg-secondary/50 rounded-lg p-4 transition-transform hover:translate-y-[-2px]">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Total Trades</span>
                <span className="text-2xl font-semibold">{mockTradingData.length}</span>
              </div>
              <div className="p-2 rounded-full bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mockTradingData}
              margin={{
                top: 5,
                right: 5,
                left: 5,
                bottom: 5,
              }}
            >
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
                stroke={theme === 'dark' ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                hide={true}
              />
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Profit/Loss"]}
                contentStyle={{
                  backgroundColor: theme === 'dark' ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                  border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  padding: '8px',
                  color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
                }}
              />
              <Bar 
                dataKey="profit" 
                radius={[4, 4, 0, 0]}
                fill={(datum) => (datum.profit >= 0 ? 'hsl(var(--primary))' : 'hsl(var(--destructive))')}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
