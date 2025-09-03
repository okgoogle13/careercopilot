// Script to create and upload template images to Firebase Storage
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import fs from 'fs';
import { createCanvas } from 'canvas';

const firebaseConfig = {
  apiKey: "AIzaSyDJFFXqfDSBZ4yoGAjaA3p60fg4fAONpSg",
  authDomain: "careercopilot-staging.firebaseapp.com",
  projectId: "careercopilot-staging",
  storageBucket: "careercopilot-staging.firebasestorage.app",
  messagingSenderId: "473068119033",
  appId: "1:473068119033:web:d5d5c8582c6912c8a21328"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Template definitions
const templates = [
  { id: 'executive-professional', name: 'Executive Professional', color: '#1e40af' },
  { id: 'modern-minimalist', name: 'Modern Minimalist', color: '#059669' },
  { id: 'creative-portfolio', name: 'Creative Portfolio', color: '#dc2626' },
  { id: 'tech-specialist', name: 'Tech Specialist', color: '#7c3aed' },
  { id: 'startup-ready', name: 'Startup Ready', color: '#ea580c' },
  { id: 'design-focused', name: 'Design Focused', color: '#be185d' }
];

function createTemplateImage(templateName, color, width = 300, height = 400) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Header section
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, 80);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('RESUME', width / 2, 30);
  ctx.fillText(templateName.toUpperCase(), width / 2, 55);

  // Mock content lines
  ctx.fillStyle = '#333333';
  ctx.font = '12px Arial';
  ctx.textAlign = 'left';

  // Name section
  ctx.fillStyle = color;
  ctx.fillRect(20, 100, width - 40, 2);
  ctx.fillStyle = '#333333';
  ctx.fillText('JOHN DOE', 20, 125);
  ctx.font = '10px Arial';
  ctx.fillStyle = '#666666';
  ctx.fillText('Software Engineer', 20, 140);

  // Experience section
  ctx.fillStyle = color;
  ctx.fillRect(20, 160, width - 40, 1);
  ctx.fillStyle = '#333333';
  ctx.font = 'bold 12px Arial';
  ctx.fillText('EXPERIENCE', 20, 180);

  // Mock experience entries
  ctx.font = '10px Arial';
  ctx.fillStyle = '#333333';
  ctx.fillText('Senior Developer (2020-2024)', 20, 200);
  ctx.fillText('• Led development of web applications', 20, 215);
  ctx.fillText('• Managed team of 5 developers', 20, 230);

  ctx.fillText('Frontend Developer (2018-2020)', 20, 250);
  ctx.fillText('• Built responsive user interfaces', 20, 265);
  ctx.fillText('• Optimized application performance', 20, 280);

  // Skills section
  ctx.fillStyle = color;
  ctx.fillRect(20, 300, width - 40, 1);
  ctx.fillStyle = '#333333';
  ctx.font = 'bold 12px Arial';
  ctx.fillText('SKILLS', 20, 320);

  ctx.font = '10px Arial';
  ctx.fillText('JavaScript • React • Node.js • Python', 20, 340);
  ctx.fillText('AWS • Docker • Git • Agile', 20, 355);

  return canvas.toBuffer('image/png');
}

async function uploadImage(imageBuffer, fileName) {
  try {
    const storageRef = ref(storage, `templates/${fileName}`);
    const result = await uploadBytes(storageRef, imageBuffer);
    const downloadURL = await getDownloadURL(result.ref);
    console.log(`✅ Uploaded ${fileName}: ${downloadURL}`);
    return downloadURL;
  } catch (error) {
    console.error(`❌ Failed to upload ${fileName}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting template image upload to Firebase Storage...');

  try {
    for (const template of templates) {
      console.log(`\n📸 Creating images for ${template.name}...`);

      // Create thumbnail (smaller version)
      const thumbnailBuffer = createTemplateImage(template.name, template.color, 200, 260);
      const thumbnailFileName = `${template.id}-thumb.png`;
      await uploadImage(thumbnailBuffer, thumbnailFileName);

      // Create full-size version
      const fullSizeBuffer = createTemplateImage(template.name, template.color, 400, 520);
      const fullSizeFileName = `${template.id}-full.png`;
      await uploadImage(fullSizeBuffer, fullSizeFileName);
    }

    console.log('\n🎉 All template images uploaded successfully!');
    console.log('\nYou can now test the templates at: http://localhost:5173/document-generation');

  } catch (error) {
    console.error('\n❌ Upload failed:', error.message);
    process.exit(1);
  }
}

main();