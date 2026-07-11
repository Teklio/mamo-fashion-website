import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

// Pointing to the public/images directory in your Next.js project
const imagesDir = path.join(process.cwd(), 'public/images');

async function optimizeImages() {
  try {
    const files = await fs.readdir(imagesDir);
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f));
    
    console.log(`Found ${imageFiles.length} images to optimize in ${imagesDir}...`);
    
    let totalSavedBytes = 0;

    for (const file of imageFiles) {
      const filePath = path.join(imagesDir, file);
      const tempPath = path.join(imagesDir, `temp_${file}`);
      
      const originalStats = await fs.stat(filePath);
      const originalSize = originalStats.size;

      console.log(`Optimizing ${file} (${(originalSize / 1024).toFixed(2)} KB)...`);
      
      const isPng = /\.png$/i.test(file);
      
      // Resize to a max width of 1200 to prevent ultra-massive images
      const processor = sharp(filePath).resize({ width: 1200, withoutEnlargement: true });
        
      // Compress with high quality but smaller footprint
      if (isPng) {
        await processor.png({ quality: 80, compressionLevel: 8 }).toFile(tempPath);
      } else {
        await processor.jpeg({ quality: 80, progressive: true }).toFile(tempPath);
      }
      
      const optimizedStats = await fs.stat(tempPath);
      const optimizedSize = optimizedStats.size;
      
      // Overwrite the original file with the optimized version to avoid changing codebase paths
      await fs.rename(tempPath, filePath);
      
      const savedBytes = originalSize - optimizedSize;
      totalSavedBytes += savedBytes;
      
      console.log(`  -> New size: ${(optimizedSize / 1024).toFixed(2)} KB (Saved ${(savedBytes / 1024).toFixed(2)} KB)`);
    }
    
    console.log(`\n🎉 Image optimization complete! Total space saved: ${(totalSavedBytes / 1024 / 1024).toFixed(2)} MB`);
    
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error("❌ Sharp is not installed. Please run: npm install sharp");
    } else {
      console.error("❌ Error during image optimization:", error);
    }
  }
}

optimizeImages();
