# API Contracts & Integration Plan - Marvin's Contracting

## Overview
This document outlines the backend API structure, database models, and frontend-backend integration for Marvin's Contracting portfolio website.

---

## 1. Database Models

### Contact Inquiry Model
```python
{
    "id": "uuid",
    "name": "string",
    "email": "string",
    "phone": "string",
    "message": "string",
    "language": "string (en/es)",
    "status": "string (new/contacted/completed)",
    "created_at": "datetime",
    "updated_at": "datetime"
}
```

### Gallery Image Model
```python
{
    "id": "uuid",
    "filename": "string",
    "url": "string",
    "category": "string (kitchen/bathroom/flooring/painting)",
    "alt_text": "string",
    "order": "integer",
    "is_active": "boolean",
    "created_at": "datetime"
}
```

---

## 2. Backend API Endpoints

### Contact Form Endpoints

#### POST /api/contact
- **Purpose**: Submit contact form inquiry
- **Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "message": "string",
  "language": "string"
}
```
- **Response**: 
```json
{
  "success": true,
  "message": "Inquiry submitted successfully",
  "inquiry_id": "uuid"
}
```
- **Actions**:
  - Save inquiry to MongoDB
  - Send WhatsApp notification to Marvin
  - Return success response

#### GET /api/contact
- **Purpose**: Get all contact inquiries (admin)
- **Response**: Array of contact inquiries
- **Auth**: Optional (for future admin panel)

---

### Gallery Endpoints

#### GET /api/gallery
- **Purpose**: Get all active gallery images
- **Query Params**: `category` (optional)
- **Response**:
```json
{
  "images": [
    {
      "id": "uuid",
      "url": "/portfolio/filename.jpg",
      "category": "kitchen",
      "alt_text": "Kitchen Remodeling"
    }
  ]
}
```

#### GET /api/gallery/:category
- **Purpose**: Get images by category
- **Response**: Filtered array of images

#### POST /api/gallery
- **Purpose**: Add new image to gallery (admin)
- **Request**: FormData with image file and metadata
- **Response**: Created image object

---

## 3. WhatsApp Integration

### Implementation Strategy
- Use WhatsApp Business API or Twilio WhatsApp
- Send notification when new contact form submitted
- Message format:
```
🔔 New Inquiry - Marvin's Contracting

Name: [name]
Phone: [phone]
Email: [email]
Message: [message]
Language: [EN/ES]
Time: [timestamp]

Reply to this inquiry at: [admin_url]
```

### Configuration (Environment Variables)
```
WHATSAPP_PHONE_NUMBER=+1234567890
WHATSAPP_API_KEY=xxx
WHATSAPP_API_URL=https://api.whatsapp.com/...
```

---

## 4. Frontend Changes Required

### Contact Form Component (Home.jsx)
**Current**: Saves to localStorage (MOCK)
**New**: POST to /api/contact

```javascript
// Replace mock implementation
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(`${API}/contact`, {
      ...formData,
      language
    });
    
    if (response.data.success) {
      toast({
        title: t.contact.success,
        description: language === 'en' 
          ? 'We will get back to you shortly.' 
          : 'Nos pondremos en contacto con usted en breve.',
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
    }
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to submit inquiry. Please try again.',
      variant: 'destructive'
    });
  }
};
```

### Gallery Component (Home.jsx)
**Current**: Uses static mock data from data.js
**New**: Fetch from /api/gallery on component mount

```javascript
// Add state and useEffect
const [galleryImages, setGalleryImages] = useState([]);

useEffect(() => {
  const fetchGallery = async () => {
    try {
      const response = await axios.get(`${API}/gallery`);
      setGalleryImages(response.data.images);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
      // Fallback to mock data
    }
  };
  fetchGallery();
}, []);
```

---

## 5. File Structure Changes

### Backend Files to Create
```
/app/backend/
├── models/
│   ├── contact.py       # Contact inquiry model
│   └── gallery.py       # Gallery image model
├── routes/
│   ├── contact.py       # Contact endpoints
│   └── gallery.py       # Gallery endpoints
├── services/
│   └── whatsapp.py      # WhatsApp notification service
└── utils/
    └── validators.py    # Input validation
```

### Frontend Files to Modify
```
/app/frontend/src/
├── pages/Home.jsx       # Update contact form & gallery
└── mock/data.js         # Keep as fallback only
```

---

## 6. Implementation Steps

1. ✅ Create backend models (contact, gallery)
2. ✅ Implement contact form API endpoint
3. ✅ Implement WhatsApp notification service
4. ✅ Implement gallery API endpoints
5. ✅ Initialize gallery database with existing images
6. ✅ Update frontend contact form integration
7. ✅ Update frontend gallery to use API
8. ✅ Test all endpoints
9. ✅ Test WhatsApp notifications

---

## 7. Mock Data Migration

All 76 images currently in `/app/frontend/public/portfolio/` will be:
- Inserted into MongoDB gallery collection with proper categories
- Served via API instead of mock data
- Frontend will seamlessly transition from mock to real data

---

## 8. Error Handling

### Backend
- Validate all inputs
- Handle database connection errors
- Log all errors for debugging
- Return appropriate HTTP status codes

### Frontend
- Show user-friendly error messages via toast
- Graceful fallback to mock data if API fails
- Loading states during API calls

---

## Notes
- WhatsApp integration requires API credentials (will ask user)
- Gallery management UI can be added later as admin panel
- All APIs follow RESTful conventions
- CORS already configured in server.py
