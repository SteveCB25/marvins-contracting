from fastapi import APIRouter, HTTPException, status, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
import logging

from models.gallery import GalleryImage, GalleryImageCreate

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/gallery", tags=["gallery"])


async def get_gallery_images(
    db: AsyncIOMotorDatabase,
    category: Optional[str] = None
):
    """
    Get all active gallery images, optionally filtered by category
    """
    try:
        query = {"is_active": True}
        if category:
            query["category"] = category
        
        images = await db.gallery_images.find(query, {"_id": 0}).sort("order", 1).to_list(1000)
        
        return {
            "images": [
                {
                    "id": img["id"],
                    "url": img["url"],
                    "thumbnail": img["url"],  # Same as url for now
                    "category": img["category"],
                    "alt": img["alt_text"]
                }
                for img in images
            ]
        }
    except Exception as e:
        logger.error(f"Error fetching gallery images: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch gallery images"
        )


async def get_gallery_by_category(category: str, db: AsyncIOMotorDatabase):
    """
    Get gallery images for a specific category
    """
    valid_categories = ["kitchen", "bathroom", "flooring", "painting"]
    if category not in valid_categories:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid category. Must be one of: {', '.join(valid_categories)}"
        )
    
    return await get_gallery_images(db, category=category)


async def create_gallery_image(image_input: GalleryImageCreate, db: AsyncIOMotorDatabase):
    """
    Add a new image to the gallery (admin)
    """
    try:
        # Generate URL from filename
        url = f"/portfolio/{image_input.filename}"
        
        # Generate alt text if not provided
        alt_text = image_input.alt_text or f"{image_input.category.title()} by Marvin's Contracting"
        
        # Create gallery image object
        gallery_image = GalleryImage(
            filename=image_input.filename,
            url=url,
            category=image_input.category,
            alt_text=alt_text,
            order=image_input.order
        )
        
        # Convert datetime to ISO string for MongoDB
        doc = gallery_image.dict()
        doc['created_at'] = doc['created_at'].isoformat()
        
        # Save to database
        result = await db.gallery_images.insert_one(doc)
        
        if not result.inserted_id:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save image"
            )
        
        logger.info(f"New gallery image created: {gallery_image.id}")
        return gallery_image.dict()
        
    except Exception as e:
        logger.error(f"Error creating gallery image: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create gallery image"
        )