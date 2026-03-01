from fastapi import APIRouter, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
import logging

from models.contact import ContactInquiry, ContactInquiryCreate
from services.whatsapp import whatsapp_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/contact", tags=["contact"])


async def create_contact_inquiry(inquiry_input: ContactInquiryCreate, db: AsyncIOMotorDatabase):
    """
    Submit a new contact inquiry
    """
    try:
        # Create inquiry object
        inquiry = ContactInquiry(**inquiry_input.dict())
        
        # Convert datetime to ISO string for MongoDB
        doc = inquiry.dict()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        
        # Save to database
        result = await db.contact_inquiries.insert_one(doc)
        
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


async def get_contact_inquiries(db: AsyncIOMotorDatabase, limit: int = 100):
    """
    Get all contact inquiries (admin)
    """
    try:
        inquiries = await db.contact_inquiries.find({}, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
        
        # Convert ISO strings back to datetime for response
        for inquiry in inquiries:
            if isinstance(inquiry.get('created_at'), str):
                from datetime import datetime
                inquiry['created_at'] = datetime.fromisoformat(inquiry['created_at'])
            if isinstance(inquiry.get('updated_at'), str):
                from datetime import datetime
                inquiry['updated_at'] = datetime.fromisoformat(inquiry['updated_at'])
        
        return inquiries
    except Exception as e:
        logger.error(f"Error fetching contact inquiries: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch inquiries"
        )