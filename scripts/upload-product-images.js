/**
 * Sanity Product Image Upload Script
 * 
 * This script reads product images from local folders and uploads them to Sanity CMS,
 * replacing existing images with the new 5-image set in the correct order:
 * 1. Showcase (hero image)
 * 2. Front
 * 3. Benefits
 * 4. Ingredients
 * 5. Back
 * 
 * Run: node scripts/upload-product-images.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Sanity client configuration
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'dsifqj4y',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
    apiVersion: '2024-01-01',
});

// Path to the product images folder
const IMAGES_FOLDER = path.join(__dirname, '..', 'Vishwa Wellness Products');

// Mapping of folder names to Sanity product slugs
// Updated with actual slugs from Sanity database
const FOLDER_TO_PRODUCT_MAP = {
    'Acido Wellness': 'vishwa-acido-wellness-acidity-relief',
    'Artho Wellness': 'vishwa-artho-wellness-joint-pain-relief',
    'Calci Wellness': 'vishwa-calci-wellness-bone-strength',
    'Cardio Wellness': 'vishwa-cardio-wellness-heart-health',
    'Hair Care Tablets': 'vishwa-hair-care-tablets-hair-health',
    'Hemo Wellness': 'vishwa-hemo-wellness-skin-health-glow',
    // 'Kids Wellness Chocolate': null, // No matching product in Sanity
    'Livo Wellness': 'vishwa-livo-wellness-liver-detox',
    'Memo Wellness': 'vishwa-memo-wellness-memory-focus',
    "Men's  Wellness": 'vishwa-mens-wellness-vitality-stamina',
    "Men_s Wellness Vanilla": 'vishwa-mens-wellness-vitality-stamina', // Same product, different flavor
    'Menso Wellness': 'vishwa-menso-wellness-pcod-pcos-support',
    'Mother Wellness': 'vishwa-mothers-wellness-maternal-support',
    'Reno Wellness': 'vishwa-reno-wellness-kidney-support',
    'Revive Wellness': 'vishwa-revive-wellness-stress-relief',
    // 'SHATAVARI KALPA': null, // No matching product in Sanity
    // 'Samya Tablets': null, // No matching product in Sanity (might be Dibo Wellness?)
    'Sleep Well Tablets': 'sleep-well-tablet-sleep-support',
    'Vita Wellness': 'vishwa-vita-wellness-daily-multivitamin',
    'Women Wellness': 'vishwa-womens-wellness-feminine-health',
    "Women's  Wellness kesar pista": 'vishwa-womens-wellness-feminine-health', // Same product, different flavor
};


// Image type patterns for identifying image purpose (case-insensitive)
const IMAGE_PATTERNS = {
    showcase: /showcase/i,
    front: /front/i,
    benefits: /benefit/i,
    ingredients: /ingredient/i,
    back: /back/i,
};

/**
 * Categorizes images in a folder based on filename patterns
 */
function categorizeImages(files) {
    const categorized = {
        showcase: null,
        front: null,
        benefits: null,
        ingredients: null,
        back: null,
        other: [],
    };

    for (const file of files) {
        // Skip non-image files
        if (!/\.(jpg|jpeg|png|webp|gif)$/i.test(file)) {
            continue;
        }

        let matched = false;
        for (const [type, pattern] of Object.entries(IMAGE_PATTERNS)) {
            if (pattern.test(file)) {
                categorized[type] = file;
                matched = true;
                break;
            }
        }

        if (!matched) {
            categorized.other.push(file);
        }
    }

    return categorized;
}

/**
 * Builds the ordered image array based on the required order
 */
function buildOrderedImageList(categorized) {
    const ordered = [];

    // Priority order: Showcase, Front, Benefits, Ingredients, Back
    if (categorized.showcase) ordered.push(categorized.showcase);
    if (categorized.front) ordered.push(categorized.front);
    if (categorized.benefits) ordered.push(categorized.benefits);
    if (categorized.ingredients) ordered.push(categorized.ingredients);
    if (categorized.back) ordered.push(categorized.back);

    // Add any remaining images at the end
    ordered.push(...categorized.other);

    return ordered;
}

/**
 * Uploads an image file to Sanity
 */
async function uploadImage(filePath, filename) {
    try {
        const imageBuffer = fs.readFileSync(filePath);
        const asset = await client.assets.upload('image', imageBuffer, {
            filename: filename,
        });
        console.log(`  ✓ Uploaded: ${filename}`);
        return asset;
    } catch (error) {
        console.error(`  ✗ Failed to upload ${filename}:`, error.message);
        return null;
    }
}

/**
 * Finds a product in Sanity by slug
 */
async function findProductBySlug(slug) {
    try {
        const product = await client.fetch(
            `*[_type == "product" && slug.current == $slug && !(_id match "drafts.*") && !(_id match "versions.*")][0]{_id, name, slug}`,
            { slug }
        );
        return product;
    } catch (error) {
        console.error(`  ✗ Error finding product with slug ${slug}:`, error.message);
        return null;
    }
}

/**
 * Updates a product's images array
 */
async function updateProductImages(productId, imageAssets) {
    try {
        const images = imageAssets.map((asset) => ({
            _type: 'image',
            _key: asset._id.replace('image-', '').substring(0, 12),
            asset: {
                _type: 'reference',
                _ref: asset._id,
            },
        }));

        await client
            .patch(productId)
            .set({ images })
            .commit();

        console.log(`  ✓ Updated product images (${images.length} images)`);
        return true;
    } catch (error) {
        console.error(`  ✗ Failed to update product:`, error.message);
        return false;
    }
}

/**
 * Processes a single product folder
 */
async function processProductFolder(folderName) {
    console.log(`\n📦 Processing: ${folderName}`);

    const folderPath = path.join(IMAGES_FOLDER, folderName);

    // Check if folder exists
    if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
        console.log(`  ⚠ Skipping: Not a directory`);
        return { success: false, skipped: true };
    }

    // Get the product slug
    const productSlug = FOLDER_TO_PRODUCT_MAP[folderName];
    if (!productSlug) {
        console.log(`  ⚠ Skipping: No mapping found for folder "${folderName}"`);
        return { success: false, skipped: true, reason: 'no-mapping' };
    }

    // Find the product in Sanity
    const product = await findProductBySlug(productSlug);
    if (!product) {
        console.log(`  ⚠ Skipping: Product with slug "${productSlug}" not found in Sanity`);
        return { success: false, skipped: true, reason: 'product-not-found' };
    }

    console.log(`  Found product: ${product.name} (${product._id})`);

    // Get all files in the folder
    const files = fs.readdirSync(folderPath);

    // Categorize images
    const categorized = categorizeImages(files);

    // Build ordered list
    const orderedImages = buildOrderedImageList(categorized);

    if (orderedImages.length === 0) {
        console.log(`  ⚠ Skipping: No images found in folder`);
        return { success: false, skipped: true, reason: 'no-images' };
    }

    console.log(`  Found ${orderedImages.length} images to upload:`);
    orderedImages.forEach((img, i) => console.log(`    ${i + 1}. ${img}`));

    // Upload images
    const uploadedAssets = [];
    for (const imageFile of orderedImages) {
        const filePath = path.join(folderPath, imageFile);
        const asset = await uploadImage(filePath, imageFile);
        if (asset) {
            uploadedAssets.push(asset);
        }
    }

    if (uploadedAssets.length === 0) {
        console.log(`  ✗ No images were uploaded successfully`);
        return { success: false, skipped: false, reason: 'upload-failed' };
    }

    // Update the product with new images
    const success = await updateProductImages(product._id, uploadedAssets);

    return { success, skipped: false };
}

/**
 * Main function
 */
async function main() {
    console.log('🚀 Sanity Product Image Upload Script');
    console.log('=====================================\n');

    // Verify Sanity token
    if (!process.env.SANITY_API_TOKEN) {
        console.error('❌ Error: SANITY_API_TOKEN not found in environment variables');
        process.exit(1);
    }

    // Verify images folder exists
    if (!fs.existsSync(IMAGES_FOLDER)) {
        console.error(`❌ Error: Images folder not found: ${IMAGES_FOLDER}`);
        process.exit(1);
    }

    // Get all folders
    const folders = fs.readdirSync(IMAGES_FOLDER).filter((item) => {
        const itemPath = path.join(IMAGES_FOLDER, item);
        return fs.statSync(itemPath).isDirectory();
    });

    console.log(`Found ${folders.length} product folders\n`);

    // Process each folder
    const results = {
        success: [],
        failed: [],
        skipped: [],
    };

    for (const folder of folders) {
        const result = await processProductFolder(folder);

        if (result.skipped) {
            results.skipped.push({ folder, reason: result.reason });
        } else if (result.success) {
            results.success.push(folder);
        } else {
            results.failed.push({ folder, reason: result.reason });
        }
    }

    // Print summary
    console.log('\n\n📊 Summary');
    console.log('==========');
    console.log(`✅ Successfully updated: ${results.success.length}`);
    console.log(`❌ Failed: ${results.failed.length}`);
    console.log(`⚠️ Skipped: ${results.skipped.length}`);

    if (results.success.length > 0) {
        console.log('\n✅ Successfully updated products:');
        results.success.forEach((f) => console.log(`   - ${f}`));
    }

    if (results.failed.length > 0) {
        console.log('\n❌ Failed products:');
        results.failed.forEach((f) => console.log(`   - ${f.folder}: ${f.reason}`));
    }

    if (results.skipped.length > 0) {
        console.log('\n⚠️ Skipped products:');
        results.skipped.forEach((f) => console.log(`   - ${f.folder}: ${f.reason || 'unknown'}`));
    }
}

// Run the script
main().catch(console.error);
