import os
import logging
from datetime import datetime
import requests

logger = logging.getLogger(__name__)


class WhatsAppService:
    def __init__(self):
        self.phone_number = os.environ.get('WHATSAPP_PHONE_NUMBER', '')
        self.api_key = os.environ.get('WHATSAPP_API_KEY', '')
        self.api_url = os.environ.get('WHATSAPP_API_URL', '')
        self.enabled = bool(self.phone_number and self.api_key)

    def send_inquiry_notification(self, inquiry_data: dict) -> bool:
        """
        Send WhatsApp notification for new contact inquiry
        """
        if not self.enabled:
            logger.warning("WhatsApp service not configured. Skipping notification.")
            return False

        try:
            message = self._format_inquiry_message(inquiry_data)
            
            # This is a generic implementation
            # Adjust based on your WhatsApp API provider (Twilio, WhatsApp Business API, etc.)
            response = requests.post(
                self.api_url,
                headers={
                    'Authorization': f'Bearer {self.api_key}',
                    'Content-Type': 'application/json'
                },
                json={
                    'to': self.phone_number,
                    'body': message
                },
                timeout=10
            )
            
            if response.status_code == 200:
                logger.info(f"WhatsApp notification sent for inquiry: {inquiry_data.get('id')}")
                return True
            else:
                logger.error(f"WhatsApp notification failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending WhatsApp notification: {str(e)}")
            return False

    def _format_inquiry_message(self, inquiry: dict) -> str:
        """
        Format inquiry data into WhatsApp message
        """
        lang_label = "EN" if inquiry.get('language') == 'en' else "ES"
        timestamp = datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')
        
        message = f"""🔔 *New Inquiry - Marvin's Contracting*

*Name:* {inquiry.get('name')}
*Phone:* {inquiry.get('phone')}
*Email:* {inquiry.get('email')}
*Language:* {lang_label}
*Time:* {timestamp}

*Message:*
{inquiry.get('message')}

---
Inquiry ID: {inquiry.get('id')}
"""
        return message


# Singleton instance
whatsapp_service = WhatsAppService()