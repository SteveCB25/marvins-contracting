# Marvin's Contracting - Product Requirements Document

## Original Problem Statement
Build a professional, modern, mobile-first, one-page portfolio website for a general contractor named "Marvin's Contracting".

## Target Audience
Homeowners in Maryland looking for reliable, trustworthy contracting services for kitchen remodels, bathroom renovations, flooring, and painting.

## Core Requirements
- **Design:** Modern, trustworthy, high-end but approachable
- **Palette:** Charcoal (#1A1A1A), White, Gold accent (#D4AF37)
- **Typography:** Outfit (headings), Manrope (body)
- **Sections:** Hero, Trust Signals, Services, Portfolio, About, Contact
- **Bilingual:** English/Spanish toggle
- **Mobile-first:** Fully responsive design

## Key Features

### Hero Section
- Full-width background image from portfolio
- Headline: "Quality Craftsmanship. Reliable Service."
- Two CTAs: "Request a Free Estimate" (primary), "View Our Work" (secondary)
- Licensed & Insured badge
- Click-to-call phone number in nav

### Trust Signals Bar
- 20+ Years Experience
- Licensed & Insured
- 5-Star Rated
- Locally Owned

### Services Section (Bento Grid)
- Kitchen Remodeling
- Bathroom Renovation
- Flooring
- Painting
- Each with icon, description, "View Projects" link

### Portfolio Gallery
- Category filter buttons (All, Kitchen, Bathroom, Flooring, Painting)
- Grid layout with hover effects
- Lightbox view for full images
- 76 real project photos

### Before/After Section
- Interactive comparison slider using react-compare-slider

### Contact Section
- Split layout: info left, form right
- Form fields: Name, Email, Phone, Service dropdown, Message
- Formspree integration
- Click-to-call phone

## Technical Stack
- **Frontend:** React, Tailwind CSS, shadcn/ui
- **Animations:** framer-motion
- **Slider:** react-compare-slider
- **Form:** Formspree (https://formspree.io/f/mojnzzwr)
- **Backend:** FastAPI (not currently connected)
- **Database:** MongoDB Atlas (connection failing)
- **Deployment:** Vercel (frontend), Railway (backend)
- **Domain:** marvinscontracting.com (DNS configured)

## Current Status

### Working
- Complete frontend redesign with all sections
- Bilingual support (EN/ES)
- Gallery with category filters
- Lightbox image viewer
- Before/After slider
- Contact form via Formspree
- Performance optimized (thumbnails + lazy loading)
- Custom domain DNS configured

### Known Issues
- Backend MongoDB connection failing (using mock data for gallery)
- Root domain SSL certificate provisioning (www.marvinscontracting.com works)

## Contact Information
- Phone: (240) 467-4308
- Service Area: Maryland

## Files Reference
- `frontend/src/pages/Home.jsx` - Main redesigned component
- `frontend/src/mock/data.js` - Gallery images and translations
- `frontend/src/components/Lightbox.jsx` - Image lightbox
- `frontend/public/thumbnails/` - Optimized thumbnails (1.6MB total)
- `frontend/public/portfolio/` - Full images (8.9MB total)
- `design_guidelines.json` - Design system specs
