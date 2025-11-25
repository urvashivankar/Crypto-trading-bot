
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Moon, Sun, Menu, X, Home, BarChart3, Settings, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed w-full z-50 top-0 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-lg text-foreground">CryptoTrader</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {isAuthenticated && (
              <div className="flex space-x-4 mr-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? 'text-primary bg-primary/10'
                        : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    <span className="flex items-center space-x-1">
                      <link.icon className="h-4 w-4" />
                      <span>{link.name}</span>
                    </span>
                  </Link>
                ))}
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-slate-700" />
              )}
            </Button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  className="rounded-full"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/signin">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full mr-2"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-slate-700" />
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-background/95 backdrop-blur-lg ${
          mobileMenuOpen ? 'block animate-fade-in' : 'hidden'
        }`}
      >
        <div className="pt-2 pb-3 space-y-1 px-4 border-t border-border">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/') ? 'text-primary bg-primary/10' : 'text-foreground/70'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </span>
          </Link>
          
          {isAuthenticated ? (
            <>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.path) ? 'text-primary bg-primary/10' : 'text-foreground/70'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center space-x-2">
                    <link.icon className="h-5 w-5" />
                    <span>{link.name}</span>
                  </span>
                </Link>
              ))}
              <div className="px-3 py-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign out
                </Button>
              </div>
            </>
          ) : (
            <div className="pt-4 pb-3 border-t border-border">
              <div className="flex items-center px-3 space-x-3">
                <Link
                  to="/signin"
                  className="block w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full">Sign in</Button>
                </Link>
                <Link
                  to="/signup"
                  className="block w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full">Sign up</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
