
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';

interface AuthFormProps {
  type: 'signin' | 'signup';
}

export default function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (type === 'signin') {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      navigate('/dashboard');
    } catch (err) {
      setError('Authentication failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {type === 'signin' ? 'Sign In' : 'Create Account'}
        </CardTitle>
        <CardDescription>
          {type === 'signin' 
            ? 'Enter your credentials to access your account.' 
            : 'Fill out the form below to create your account.'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {type === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {type === 'signin' && (
                <a href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </a>
              )}
            </div>
            <Input 
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full btn-hover" 
            disabled={isLoading}
          >
            {isLoading ? (
              'Loading...'
            ) : type === 'signin' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </Button>
          
          <div className="text-sm text-center text-muted-foreground">
            {type === 'signin' ? (
              <>
                Don't have an account?{' '}
                <a 
                  href="/signup" 
                  className="text-primary hover:underline"
                >
                  Sign up
                </a>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <a 
                  href="/signin" 
                  className="text-primary hover:underline"
                >
                  Sign in
                </a>
              </>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
