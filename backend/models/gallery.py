from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid


class GalleryImage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    filename: str
    url: str
    category: str  # kitchen, bathroom, flooring, painting
    alt_text: str
    order: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "filename": "kitchen_001.jpg",
                "url": "/portfolio/kitchen_001.jpg",
                "category": "kitchen",
                "alt_text": "Modern Kitchen Remodeling",
                "order": 1,
                "is_active": True
            }
        }


class GalleryImageCreate(BaseModel):
    filename: str
    category: str
    alt_text: Optional[str] = None
    order: Optional[int] = 0