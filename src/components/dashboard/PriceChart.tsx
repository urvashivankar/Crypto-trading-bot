
import { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/context/ThemeContext';

interface PriceDataPoint {
  date: string;
  price: number;
}

interface PriceChartProps {
  data: PriceDataPoint[];
  coin: string;
  symbol: string;
  currentPrice: number;
  priceChange: number;
}

export default function PriceChart({
  data,
  coin,
  symbol,
  currentPrice,
  priceChange
}: PriceChartProps) {
  const { theme } = useTheme();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  };
  
  const chartData = useMemo(() => {
    return data.map(item => ({
      date: item.date,
      price: item.price,
    }));
  }, [data]);
  
  const isPriceUp = priceChange >= 0;
  
  const gradientOffset = useMemo(() => {
    if (chartData.length === 0) return 0;
    
    const dataMax = Math.max(...chartData.map(item => item.price));
    const dataMin = Math.min(...chartData.map(item => item.price));
    
    if (dataMax === dataMin) return 0;
    
    return dataMin / (dataMax - dataMin);
  }, [chartData]);

  return (
    <Card className="h-full shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-muted-foreground">
              {coin} ({symbol})
            </div>
            <CardTitle className="text-2xl font-semibold mt-1">
              {formatCurrency(currentPrice)}
            </CardTitle>
          </div>
          <div className={`px-2 py-1 rounded-md text-sm font-medium ${
            isPriceUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
          }`}>
            {isPriceUp ? '+' : ''}{priceChange.toFixed(2)}%
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-0 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={isPriceUp ? "rgba(22, 163, 74, 0.8)" : "rgba(220, 38, 38, 0.8)"} 
                  stopOpacity={0.8}
                />
                <stop 
                  offset="95%" 
                  stopColor={isPriceUp ? "rgba(22, 163, 74, 0.1)" : "rgba(220, 38, 38, 0.1)"} 
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme === 'dark' ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} 
              vertical={false}
            />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              stroke={theme === 'dark' ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
            />
            <YAxis 
              domain={['auto', 'auto']}
              tick={{ fontSize: 12 }}
              stroke={theme === 'dark' ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
                return `$${value.toFixed(value < 1 ? 2 : 0)}`;
              }}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), "Price"]}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                });
              }}
              contentStyle={{
                backgroundColor: theme === 'dark' ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                padding: '8px',
                color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
              }}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={isPriceUp ? "rgb(22, 163, 74)" : "rgb(220, 38, 38)"} 
              fillOpacity={1}
              fill="url(#colorPrice)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
