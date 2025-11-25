
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/context/ThemeContext';

export default function Settings() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [exchange, setExchange] = useState('binance');
  const [notifications, setNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  
  const handleSaveAPIKeys = () => {
    if (!apiKey || !apiSecret) {
      toast({
        title: 'Error',
        description: 'Please enter both API Key and Secret',
        variant: 'destructive',
      });
      return;
    }
    
    // In a real app, this would make an API call to save the keys securely
    toast({
      title: 'API Keys Saved',
      description: 'Your exchange API keys have been saved securely.',
    });
  };
  
  const handleSavePreferences = () => {
    toast({
      title: 'Preferences Saved',
      description: 'Your preferences have been updated successfully.',
    });
  };

  return (
    <Layout>
      <div className="container pt-20 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your trading bot and application preferences</p>
        </div>
        
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="api_keys">API Keys</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="Demo User" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="demo@example.com" />
                </div>
                
                <Button className="mt-2 btn-hover">
                  Update Profile
                </Button>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current_password">Current Password</Label>
                  <Input id="current_password" type="password" placeholder="Enter current password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new_password">New Password</Label>
                  <Input id="new_password" type="password" placeholder="Enter new password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <Input id="confirm_password" type="password" placeholder="Confirm new password" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="2fa" 
                      checked={twoFactorAuth}
                      onCheckedChange={setTwoFactorAuth}
                    />
                    <Label htmlFor="2fa">Enable Two-Factor Authentication</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add an extra layer of security to your account with 2FA.
                  </p>
                </div>
                
                <Button className="mt-2 btn-hover">
                  Update Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api_keys" className="space-y-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Exchange API Keys</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="exchange">Exchange</Label>
                  <Select value={exchange} onValueChange={setExchange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select exchange" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="binance">Binance</SelectItem>
                      <SelectItem value="coinbase">Coinbase</SelectItem>
                      <SelectItem value="kraken">Kraken</SelectItem>
                      <SelectItem value="kucoin">KuCoin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="api_key">API Key</Label>
                  <Input 
                    id="api_key" 
                    placeholder="Enter your API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="api_secret">API Secret</Label>
                  <Input 
                    id="api_secret" 
                    type="password" 
                    placeholder="Enter your API secret"
                    value={apiSecret}
                    onChange={(e) => setApiSecret(e.target.value)}
                  />
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Make sure your API key has trading permissions but NO withdrawal permissions for security.
                </p>
                
                <Button onClick={handleSaveAPIKeys} className="mt-2 btn-hover">
                  Save API Keys
                </Button>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>API Permissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="trading_permission" defaultChecked />
                    <Label htmlFor="trading_permission">Trading Permission</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Allow the bot to execute trades on your behalf.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="data_permission" defaultChecked />
                    <Label htmlFor="data_permission">Market Data Access</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Allow the bot to access market data and your account information.
                  </p>
                </div>
                
                <div className="space-y-2 opacity-50">
                  <div className="flex items-center space-x-2">
                    <Switch id="withdrawal_permission" disabled />
                    <Label htmlFor="withdrawal_permission">Withdrawal Permission (Disabled)</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    For security reasons, the bot never requires withdrawal permissions.
                  </p>
                </div>
                
                <Button className="mt-2 btn-hover">
                  Save Permissions
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences" className="space-y-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="flex items-center space-x-4">
                    <div 
                      className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        theme === 'light' ? 'bg-primary/10 border-primary' : 'bg-card border-border'
                      }`}
                      onClick={() => setTheme('light')}
                    >
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-200"></div>
                      <span>Light</span>
                    </div>
                    
                    <div 
                      className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        theme === 'dark' ? 'bg-primary/10 border-primary' : 'bg-card border-border'
                      }`}
                      onClick={() => setTheme('dark')}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700"></div>
                      <span>Dark</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="enable_notifications" 
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                    <Label htmlFor="enable_notifications">Enable Notifications</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Receive notifications for trades, price alerts, and platform updates.
                  </p>
                </div>
                
                <div className={notifications ? '' : 'opacity-50 pointer-events-none'}>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="trade_notifications" defaultChecked disabled={!notifications} />
                      <Label htmlFor="trade_notifications">Trade Executions</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="price_alerts" defaultChecked disabled={!notifications} />
                      <Label htmlFor="price_alerts">Price Alerts</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="system_notifications" defaultChecked disabled={!notifications} />
                      <Label htmlFor="system_notifications">System Updates</Label>
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleSavePreferences} className="mt-2 btn-hover">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
