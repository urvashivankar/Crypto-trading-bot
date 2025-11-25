
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ChevronRight, TrendingUp, ShieldCheck, Zap, ArrowRight, LineChart, BarChart3, Activity, Lock } from 'lucide-react';

export default function Index() {
  const featuresRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({
    users: 0,
    trades: 0,
    volume: 0,
    uptime: 0
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
          }
        });
      },
      { threshold: 0.1 }
    );

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach((el) => observer.observe(el));

    return () => {
      animateElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Animate stats counter
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    const targets = { users: 15000, trades: 250000, volume: 125, uptime: 99.9 };
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setStats({
        users: Math.floor(targets.users * progress),
        trades: Math.floor(targets.trades * progress),
        volume: Math.floor(targets.volume * progress),
        uptime: Number((targets.uptime * progress).toFixed(1))
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setStats(targets);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="pt-20 pb-16 md:pt-28 md:pb-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 pointer-events-none" />

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 text-center md:text-left animate-fade-in">
                <div className="inline-block mb-4">
                  <span className="pill bg-primary/10 text-primary border border-primary/20">
                    🚀 AI-Powered Trading Platform
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  <span className="inline-block">Intelligent</span>{' '}
                  <span className="gradient-text inline-block">Crypto Trading</span>{' '}
                  <span className="inline-block">Made Simple</span>
                </h1>

                <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto md:mx-0">
                  Automate your cryptocurrency trading with advanced AI strategies, real-time analytics, and enterprise-grade security. Join thousands of traders maximizing their profits.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link to="/signup">
                    <Button size="lg" className="text-md btn-hover animate-pulse-glow">
                      Start Trading Free
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="outline" size="lg" className="text-md btn-hover">
                      View Live Demo
                      <Activity className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="mt-10 flex flex-wrap gap-6 justify-center md:justify-start text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <span>Bank-Level Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    <span>Encrypted Data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <span>99.9% Uptime</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 animate-fade-in animate-float">
                <img
                  src="/hero-dashboard.png"
                  alt="Advanced Crypto Trading Dashboard"
                  className="hero-image w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 px-6 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="stats-card text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stats.users.toLocaleString()}+
                </div>
                <div className="text-sm text-muted-foreground">Active Traders</div>
              </div>

              <div className="stats-card text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stats.trades.toLocaleString()}+
                </div>
                <div className="text-sm text-muted-foreground">Trades Executed</div>
              </div>

              <div className="stats-card text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  ${stats.volume}M+
                </div>
                <div className="text-sm text-muted-foreground">Trading Volume</div>
              </div>

              <div className="stats-card text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stats.uptime}%
                </div>
                <div className="text-sm text-muted-foreground">Platform Uptime</div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section
          ref={featuresRef}
          className="py-20 px-6"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold animate-on-scroll">
                Powerful Features for <span className="gradient-text">Smart Trading</span>
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto animate-on-scroll">
                Our platform combines cutting-edge AI technology with an intuitive interface to give you the ultimate trading advantage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-background rounded-xl p-6 shadow-sm feature-card-hover animate-on-scroll border border-border">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Automated Trading</h3>
                <p className="text-muted-foreground">
                  Set up your trading strategies and let our AI execute trades automatically based on market conditions 24/7.
                </p>
              </div>

              <div className="bg-background rounded-xl p-6 shadow-sm feature-card-hover animate-on-scroll border border-border">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-cyan-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
                <p className="text-muted-foreground">
                  Track market movements with advanced charts, technical indicators, and AI-powered insights for better decisions.
                </p>
              </div>

              <div className="bg-background rounded-xl p-6 shadow-sm feature-card-hover animate-on-scroll border border-border">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Bank-Level Security</h3>
                <p className="text-muted-foreground">
                  Your funds and data are protected with enterprise-grade encryption and multi-factor authentication.
                </p>
              </div>

              <div className="bg-background rounded-xl p-6 shadow-sm feature-card-hover animate-on-scroll border border-border">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Multiple Strategies</h3>
                <p className="text-muted-foreground">
                  Choose from various pre-built trading strategies or create your own custom approach with our strategy builder.
                </p>
              </div>

              <div className="bg-background rounded-xl p-6 shadow-sm feature-card-hover animate-on-scroll border border-border">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-500/10 flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">24/7 Monitoring</h3>
                <p className="text-muted-foreground">
                  Our system works around the clock, constantly monitoring markets for the best trading opportunities.
                </p>
              </div>

              <div className="bg-background rounded-xl p-6 shadow-sm feature-card-hover animate-on-scroll border border-border">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-red-500/20 to-red-500/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Risk Management</h3>
                <p className="text-muted-foreground">
                  Set stop-loss and take-profit levels to automatically manage risk and protect your investments.
                </p>
              </div>
            </div>

            <div className="text-center mt-12 animate-on-scroll">
              <Link to="/signup">
                <Button size="lg" className="btn-hover">
                  Start Trading Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Analytics Showcase */}
        <section className="py-20 px-6 bg-secondary/50">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 animate-on-scroll">
                <img
                  src="/analytics-visual.png"
                  alt="Advanced Trading Analytics"
                  className="hero-image w-full h-auto"
                />
              </div>

              <div className="flex-1 animate-on-scroll">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Advanced Analytics <span className="gradient-text">at Your Fingertips</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Make data-driven decisions with our comprehensive analytics suite. Track performance, analyze trends, and optimize your trading strategies in real-time.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ChevronRight className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Technical Indicators</div>
                      <div className="text-sm text-muted-foreground">RSI, MACD, Bollinger Bands, and 50+ more indicators</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ChevronRight className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Portfolio Tracking</div>
                      <div className="text-sm text-muted-foreground">Monitor your holdings and performance across exchanges</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ChevronRight className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">AI-Powered Insights</div>
                      <div className="text-sm text-muted-foreground">Get intelligent recommendations based on market analysis</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="flex-1 animate-on-scroll">
                <img
                  src="/security-trust.png"
                  alt="Enterprise Security"
                  className="hero-image w-full h-auto"
                />
              </div>

              <div className="flex-1 animate-on-scroll">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Your Security is <span className="gradient-text">Our Priority</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Trade with confidence knowing your assets are protected by industry-leading security measures and encryption protocols.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                    <Lock className="h-8 w-8 text-primary mb-2" />
                    <div className="font-semibold">256-bit Encryption</div>
                    <div className="text-xs text-muted-foreground">Military-grade security</div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                    <ShieldCheck className="h-8 w-8 text-primary mb-2" />
                    <div className="font-semibold">2FA Protection</div>
                    <div className="text-xs text-muted-foreground">Multi-factor authentication</div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                    <Activity className="h-8 w-8 text-primary mb-2" />
                    <div className="font-semibold">24/7 Monitoring</div>
                    <div className="text-xs text-muted-foreground">Continuous threat detection</div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                    <BarChart3 className="h-8 w-8 text-primary mb-2" />
                    <div className="font-semibold">Cold Storage</div>
                    <div className="text-xs text-muted-foreground">Offline asset protection</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold animate-on-scroll mb-4">
              Ready to Transform Your <span className="gradient-text">Crypto Trading?</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground animate-on-scroll mb-10">
              Join thousands of traders who have already improved their results with our AI-powered platform. Start trading smarter today.
            </p>
            <div className="animate-on-scroll flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="text-md btn-hover animate-pulse-glow">
                  Create Free Account
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/signin">
                <Button variant="outline" size="lg" className="text-md btn-hover">
                  Sign In
                </Button>
              </Link>
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
              No credit card required • Free forever • Cancel anytime
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-secondary/50 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white font-bold text-lg">C</span>
                  </div>
                  <span className="font-bold text-lg">CryptoTrader</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  © 2024 CryptoTrader. All rights reserved.
                </p>
              </div>

              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                <a href="#" className="text-sm hover:text-primary transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-sm hover:text-primary transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm hover:text-primary transition-colors">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
