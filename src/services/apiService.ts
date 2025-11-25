/**
 * API Service Functions
 * Service layer for all backend API calls
 */

import { api } from '@/lib/api';

// Type definitions
interface RegisterData {
    email: string;
    username: string;
    password: string;
    full_name?: string;
}

interface LoginData {
    email: string;
    password: string;
}

interface TokenResponse {
    access_token: string;
    token_type: string;
}

interface User {
    id: number;
    email: string;
    username: string;
    full_name?: string;
    role: string;
    is_active: boolean;
    is_verified: boolean;
    two_factor_enabled: boolean;
    created_at: string;
}

interface CoinPrice {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    price_change_percentage_24h: number;
    market_cap?: number;
    volume_24h?: number;
}

interface PriceHistory {
    date: string;
    price: number;
}

interface CoinDetail extends CoinPrice {
    price_history: PriceHistory[];
}

interface TradeData {
    symbol: string;
    order_type: 'market' | 'limit' | 'stop_loss' | 'take_profit';
    order_side: 'buy' | 'sell';
    quantity: number;
    price?: number;
}

interface Trade {
    id: number;
    exchange_name: string;
    symbol: string;
    order_type: string;
    order_side: string;
    order_status: string;
    price?: number;
    quantity: number;
    filled_quantity: number;
    average_price?: number;
    fee: number;
    total_cost?: number;
    created_at: string;
    executed_at?: string;
}

/**
 * Authentication Service
 */
export const authService = {
    /**
     * Register a new user
     */
    register: async (data: RegisterData): Promise<User> => {
        return api.post<User>('/api/auth/register', data);
    },

    /**
     * Login user and get JWT token
     */
    login: async (data: LoginData): Promise<TokenResponse> => {
        return api.post<TokenResponse>('/api/auth/login-json', data);
    },

    /**
     * Get current authenticated user
     */
    getCurrentUser: async (): Promise<User> => {
        return api.get<User>('/api/auth/me');
    },

    /**
     * Logout user (clear local storage)
     */
    logout: () => {
        localStorage.removeItem('token');
    }
};

/**
 * Market Data Service
 */
export const marketService = {
    /**
     * Get current prices for all cryptocurrencies
     */
    getPrices: async (): Promise<CoinPrice[]> => {
        return api.get<CoinPrice[]>('/api/market/prices');
    },

    /**
     * Get detailed information for a specific coin
     */
    getCoinDetail: async (symbol: string): Promise<CoinDetail> => {
        return api.get<CoinDetail>(`/api/market/prices/${symbol}`);
    }
};

/**
 * Trading Service
 */
export const tradingService = {
    /**
     * Execute a trade
     */
    executeTrade: async (data: TradeData): Promise<Trade> => {
        return api.post<Trade>('/api/trading/trades', data);
    },

    /**
     * Get user's trade history
     */
    getTradeHistory: async (limit: number = 50): Promise<Trade[]> => {
        return api.get<Trade[]>(`/api/trading/trades?limit=${limit}`);
    },

    /**
     * Get specific trade details
     */
    getTrade: async (tradeId: number): Promise<Trade> => {
        return api.get<Trade>(`/api/trading/trades/${tradeId}`);
    }
};

// Export types for use in components
export type {
    RegisterData,
    LoginData,
    TokenResponse,
    User,
    CoinPrice,
    PriceHistory,
    CoinDetail,
    TradeData,
    Trade
};
