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
- Full-width background image from Cloudinary
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

### Portfolio Gallery
- Category filter buttons (All, Kitchen, Bathroom, Flooring, Painting)
- 6 images displayed initially
- Lightbox view for full images
- 76 project photos served via Cloudinary CDN

### Before/After Section
- Interactive comparison slider using react-compare-slider

### Contact Section
- Form fields: Name, Email, Phone, Service dropdown, Message
- Formspree integration

## Technical Stack
- **Frontend:** React, Tailwind CSS, shadcn/ui, framer-motion
- **Image CDN:** Cloudinary (cloud name: diwpfqeho)
- **Form:** Formspree (https://formspree.io/f/mojnzzwr)
- **Deployment:** Vercel (frontend)
- **Domain:** www.marvinscontracting.com

## Performance Optimizations
- Cloudinary CDN with automatic WebP/AVIF conversion
- Blur placeholders for instant visual feedback
- Only 6 images loaded initially
- No backend API calls (images served directly from Cloudinary)

## Contact Information
- Phone: (240) 467-4308
- Service Area: Maryland

## Files Reference
- `frontend/src/pages/Home.jsx` - Main component
- `frontend/src/cloudinary-gallery.json` - Cloudinary image URLs
- `frontend/src/mock/data.js` - Translations
- `frontend/src/components/OptimizedImage.jsx` - Blur placeholder component
