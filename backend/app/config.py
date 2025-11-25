"""
Configuration settings for the Crypto Trading Bot backend.
Loads environment variables and provides application configuration.
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application
    app_name: str = "Crypto Trading Bot"
    debug: bool = True
    
    # Database
    database_url: str = "sqlite:///./crypto_trading.db"
    
    # Security
    secret_key: str = "your-secret-key-change-this-in-production-min-32-characters"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS
    allowed_origins: str = "http://localhost:5173,http://localhost:3000"
    
    @property
    def cors_origins(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.allowed_origins.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
