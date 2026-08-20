from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "ProposifyAI"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "proposify_secret_key_super_secure_change_in_prod_12345"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    DATABASE_URL: str = "sqlite:///./proposifyai.db"

    OLLAMA_BASE_URL: str = "http://localhost:11434"
    AI_MODEL_NAME: str = "qwen2.5:7b"
    USE_MOCK_AI_FALLBACK: bool = True

    FIREBASE_ENABLED: bool = False
    FIREBASE_PROJECT_ID: Optional[str] = None

    model_config = SettingsConfigDict(case_sensitive=True)

settings = Settings()
