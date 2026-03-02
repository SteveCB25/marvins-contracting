/**
 * Cloudinary Gallery Sync Script
 * 
 * This script fetches images from Cloudinary and generates the gallery JSON
 * based on tags you assign in Cloudinary's Media Library.
 * 
 * HOW TO USE:
 * 1. Go to Cloudinary Media Library (https://console.cloudinary.com/console/media_library)
 * 2. Select images and add tags: "kitchen", "bathroom", "flooring", or "painting"
 * 3. Run: node scripts/sync-cloudinary.js
 * 4. Commit and push to trigger a new deploy
 * 
 * The script will automatically categorize images based on their Cloudinary tags.
 * Images without tags will be placed in "uncategorized".
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const CLOUD_NAME = 'diwpfqeho';
const API_KEY = '191845176579428';
const API_SECRET = 'L6pT-JqFocfp6hrzb3w4MOgu__M';

const VALID_CATEGORIES = ['kitchen', 'bathroom', 'flooring', 'painting'];

async function fetchCloudinaryImages() {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
    
    const options = {
      hostname: 'api.cloudinary.com',
      path: `/v1_1/${CLOUD_NAME}/resources/image?prefix=marvins&max_results=500`,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

function getCategory(tags) {
  if (!tags || tags.length === 0) return null;
  
  for (const tag of tags) {
    const lowerTag = tag.toLowerCase();
    if (VALID_CATEGORIES.includes(lowerTag)) {
      return lowerTag;
    }
  }
  return null;
}

function generateGalleryUrl(publicId, width = 400) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_${width},c_fill/${publicId}`;
}

function generateFullUrl(publicId) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_80/${publicId}`;
}

function generateBlurUrl(publicId) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_10,w_20,e_blur:1000/${publicId}`;
}

async function main() {
  console.log('Fetching images from Cloudinary...');
  
  try {
    const response = await fetchCloudinaryImages();
    const resources = response.resources || [];
    
    console.log(`Found ${resources.length} images`);
    
    const gallery = [];
    const uncategorized = [];
    
    resources.forEach((resource, index) => {
      const category = getCategory(resource.tags);
      const publicId = resource.public_id;
      
      const imageData = {
        id: index + 1,
        url: generateFullUrl(publicId),
        thumbnail: generateGalleryUrl(publicId, 400),
        blur: generateBlurUrl(publicId),
        alt: category 
          ? `${category.charAt(0).toUpperCase() + category.slice(1)} project by Marvin's Contracting`
          : "Project by Marvin's Contracting",
        category: category || 'uncategorized',
        publicId: publicId
      };
      
      if (category) {
        gallery.push(imageData);
      } else {
        uncategorized.push(imageData);
      }
    });
    
    // Sort by category
    gallery.sort((a, b) => {
      const order = { kitchen: 0, bathroom: 1, flooring: 2, painting: 3 };
      return (order[a.category] || 99) - (order[b.category] || 99);
    });
    
    // Add uncategorized at the end
    gallery.push(...uncategorized);
    
    // Save to JSON file
    const outputPath = path.join(__dirname, '../src/cloudinary-gallery.json');
    fs.writeFileSync(outputPath, JSON.stringify(gallery, null, 2));
    
    console.log(`\nGenerated gallery with ${gallery.length} images:`);
    console.log(`  - Kitchen: ${gallery.filter(i => i.category === 'kitchen').length}`);
    console.log(`  - Bathroom: ${gallery.filter(i => i.category === 'bathroom').length}`);
    console.log(`  - Flooring: ${gallery.filter(i => i.category === 'flooring').length}`);
    console.log(`  - Painting: ${gallery.filter(i => i.category === 'painting').length}`);
    console.log(`  - Uncategorized: ${uncategorized.length}`);
    console.log(`\nSaved to: ${outputPath}`);
    
    if (uncategorized.length > 0) {
      console.log('\n⚠️  Uncategorized images (add tags in Cloudinary):');
      uncategorized.slice(0, 5).forEach(img => {
        console.log(`   - ${img.publicId}`);
      });
      if (uncategorized.length > 5) {
        console.log(`   ... and ${uncategorized.length - 5} more`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
