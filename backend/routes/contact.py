from fastapi import APIRouter, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
import logging

from models.contact import ContactInquiry, ContactInquiryCreate
from services.whatsapp import whatsapp_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/contact", tags=["contact"])


def get_db():
    """Dependency to get database - will be injected"""
    pass


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_contact_inquiry(inquiry_input: ContactInquiryCreate, db: AsyncIOMotorDatabase):
    """
    Submit a new contact inquiry
    """
    try:
        # Create inquiry object
        inquiry = ContactInquiry(**inquiry_input.dict())
        
        # Save to database
        result = await db.contact_inquiries.insert_one(inquiry.dict())
        
        if not result.inserted_id:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save inquiry"
            )
        
        # Send WhatsApp notification (non-blocking)
        try:
            whatsapp_service.send_inquiry_notification(inquiry.dict())
        except Exception as e:
            logger.error(f"WhatsApp notification failed: {str(e)}")
            # Don't fail the request if WhatsApp fails
        
        logger.info(f"New contact inquiry created: {inquiry.id}")
        
        return {
            "success": True,
            "message": "Inquiry submitted successfully",
            "inquiry_id": inquiry.id
        }
        
    except Exception as e:
        logger.error(f"Error creating contact inquiry: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit inquiry"
        )


@router.get("", response_model=List[ContactInquiry])
async def get_contact_inquiries(db: AsyncIOMotorDatabase, limit: int = 100):
    """
    Get all contact inquiries (admin)
    """
    try:
        inquiries = await db.contact_inquiries.find().sort("created_at", -1).limit(limit).to_list(limit)
        return [ContactInquiry(**inquiry) for inquiry in inquiries]
    except Exception as e:
        logger.error(f"Error fetching contact inquiries: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch inquiries"
        )