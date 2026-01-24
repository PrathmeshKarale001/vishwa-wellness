/**
 * Bulk Image Upload Script for Vishwa Wellness Products
 * 
 * This script automatically:
 * 1. Scans the "Vishwa Wellness Products" folder
 * 2. Matches folder names to existing products in Sanity
 * 3. Uploads all images from each folder to the corresponding product
 * 
 * Usage: node scripts/upload-product-images.js
 * 
 * Make sure your .env.local has:
 * - NEXT_PUBLIC_SANITY_PROJECT_ID
 * - NEXT_PUBLIC_SANITY_DATASET  
 * - SANITY_API_TOKEN (with write access)
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Configuration
const IMAGES_FOLDER = path.join(__dirname, '..', 'Vishwa Wellness Products');
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// Initialize Sanity client
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

// Mapping of folder names to product identifiers (case-insensitive partial matching)
const FOLDER_TO_PRODUCT_MAPPING = {
    'acido wellness': 'acido',
    'artho wellness': 'artho',
    'calci wellness': 'calci',
    'cardio wellness': 'cardio',
    'hair care tablets': 'hair-care',
    'hemo wellness': 'hemo',
    'kids wellness chocolate': 'kids',
    'livo wellness': 'livo',
    'memo wellness': 'memo',
    'men_s wellness vanilla': 'mens',
    'menso wellness': 'menso',
    "men's  wellness": 'mens',
    'mother wellness': 'mother',
    'reno wellness': 'reno',
    'revive wellness': 'revive',
    'shatavari kalpa': 'shatavari',
    'samya tablets': 'samya',
    'sleep well tablets': 'sleep-well',
    'vita wellness': 'vita',
    'women wellness': 'women',
};

async function getProductsFromSanity() {
    console.log('📦 Fetching products from Sanity...');

    const products = await client.fetch(`
        *[_type == "product" && !(_id in path("drafts.**"))] {
            _id,
            name,
            "slug": slug.current,
            "hasImages": defined(images) && count(images) > 0
        }
    `);

    console.log(`   Found ${products.length} products in Sanity\n`);
    return products;
}

function findMatchingProduct(folderName, products) {
    const folderLower = folderName.toLowerCase();

    // Try exact mapping first
    const mappedKey = FOLDER_TO_PRODUCT_MAPPING[folderLower];
    if (mappedKey) {
        const match = products.find(p =>
            p.slug.toLowerCase().includes(mappedKey) ||
            p.name.toLowerCase().includes(mappedKey)
        );
        if (match) return match;
    }

    // Try direct slug/name matching
    for (const product of products) {
        const slugLower = product.slug.toLowerCase();
        const nameLower = product.name.toLowerCase();

        // Check if folder name contains key parts of the product
        const folderParts = folderLower.split(/[\s_-]+/).filter(p => p.length > 2);
        const matchCount = folderParts.filter(part =>
            slugLower.includes(part) || nameLower.includes(part)
        ).length;

        if (matchCount >= 2 || (matchCount === 1 && folderParts.length === 1)) {
            return product;
        }
    }

    return null;
}

function getImageFiles(folderPath) {
    if (!fs.existsSync(folderPath)) return [];

    const files = fs.readdirSync(folderPath);
    return files
        .filter(file => {
            const ext = path.extname(file).toLowerCase();
            return SUPPORTED_EXTENSIONS.includes(ext);
        })
        .map(file => ({
            name: file,
            path: path.join(folderPath, file),
            isFront: file.toLowerCase().includes('front'),
            isBack: file.toLowerCase().includes('back'),
        }))
        // Sort: front images first, then back, then others
        .sort((a, b) => {
            if (a.isFront && !b.isFront) return -1;
            if (!a.isFront && b.isFront) return 1;
            if (a.isBack && !b.isBack) return -1;
            if (!a.isBack && b.isBack) return 1;
            return a.name.localeCompare(b.name);
        });
}

async function uploadImage(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    const asset = await client.assets.upload('image', fileBuffer, {
        filename: fileName,
    });

    return asset;
}

async function updateProductImages(productId, imageAssets, productName) {
    const images = imageAssets.map((asset, index) => ({
        _type: 'image',
        _key: `img-${index}-${Date.now()}`,
        asset: {
            _type: 'reference',
            _ref: asset._id,
        },
        alt: `${productName} - Image ${index + 1}`,
    }));

    await client
        .patch(productId)
        .set({ images })
        .commit();
}

async function processFolder(folderName, products, stats) {
    const folderPath = path.join(IMAGES_FOLDER, folderName);

    // Skip if not a directory
    if (!fs.statSync(folderPath).isDirectory()) {
        return;
    }

    console.log(`\n📁 Processing: ${folderName}`);

    // Find matching product
    const product = findMatchingProduct(folderName, products);

    if (!product) {
        console.log(`   ❌ No matching product found`);
        stats.unmatched.push(folderName);
        return;
    }

    console.log(`   ✓ Matched to: ${product.name} (${product.slug})`);

    // Get image files
    const imageFiles = getImageFiles(folderPath);

    if (imageFiles.length === 0) {
        console.log(`   ⚠️ No image files found in folder`);
        stats.noImages.push(folderName);
        return;
    }

    console.log(`   📷 Found ${imageFiles.length} images: ${imageFiles.map(f => f.name).join(', ')}`);

    // Check if product already has images
    if (product.hasImages) {
        console.log(`   ⚠️ Product already has images - skipping (use --force to overwrite)`);
        stats.skipped.push({ folder: folderName, product: product.name, reason: 'already has images' });
        return;
    }

    // Upload images
    console.log(`   ⬆️ Uploading images...`);
    const uploadedAssets = [];

    for (const imageFile of imageFiles) {
        try {
            console.log(`      - Uploading ${imageFile.name}...`);
            const asset = await uploadImage(imageFile.path);
            uploadedAssets.push(asset);
            console.log(`        ✓ Done (${asset._id})`);
        } catch (error) {
            console.log(`        ❌ Failed: ${error.message}`);
            stats.errors.push({ folder: folderName, file: imageFile.name, error: error.message });
        }
    }

    if (uploadedAssets.length === 0) {
        console.log(`   ❌ No images were uploaded successfully`);
        return;
    }

    // Update product with images
    console.log(`   💾 Updating product with ${uploadedAssets.length} images...`);
    try {
        await updateProductImages(product._id, uploadedAssets, product.name);
        console.log(`   ✅ Success! Product updated with ${uploadedAssets.length} images`);
        stats.success.push({ folder: folderName, product: product.name, images: uploadedAssets.length });
    } catch (error) {
        console.log(`   ❌ Failed to update product: ${error.message}`);
        stats.errors.push({ folder: folderName, error: error.message });
    }
}

async function main() {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('   VISHWA WELLNESS - Bulk Product Image Upload Script');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Verify environment
    if (!process.env.SANITY_API_TOKEN) {
        console.error('❌ Error: SANITY_API_TOKEN not found in .env.local');
        console.error('   Please add your Sanity API token with write permissions.');
        process.exit(1);
    }

    if (!fs.existsSync(IMAGES_FOLDER)) {
        console.error(`❌ Error: Images folder not found: ${IMAGES_FOLDER}`);
        process.exit(1);
    }

    const stats = {
        success: [],
        skipped: [],
        unmatched: [],
        noImages: [],
        errors: [],
    };

    // Get products from Sanity
    const products = await getProductsFromSanity();

    // Get all folders in images directory
    const folders = fs.readdirSync(IMAGES_FOLDER).filter(f =>
        fs.statSync(path.join(IMAGES_FOLDER, f)).isDirectory()
    );

    console.log(`📂 Found ${folders.length} product folders to process`);

    // Process each folder
    for (const folder of folders) {
        await processFolder(folder, products, stats);
    }

    // Print summary
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('   SUMMARY');
    console.log('═══════════════════════════════════════════════════════════════\n');

    console.log(`✅ Successfully uploaded: ${stats.success.length} products`);
    stats.success.forEach(s => console.log(`   - ${s.product}: ${s.images} images`));

    if (stats.skipped.length > 0) {
        console.log(`\n⏭️ Skipped (already have images): ${stats.skipped.length} products`);
        stats.skipped.forEach(s => console.log(`   - ${s.product}`));
    }

    if (stats.unmatched.length > 0) {
        console.log(`\n❓ Unmatched folders: ${stats.unmatched.length}`);
        stats.unmatched.forEach(f => console.log(`   - ${f}`));
    }

    if (stats.noImages.length > 0) {
        console.log(`\n📭 No images in folder: ${stats.noImages.length}`);
        stats.noImages.forEach(f => console.log(`   - ${f}`));
    }

    if (stats.errors.length > 0) {
        console.log(`\n❌ Errors: ${stats.errors.length}`);
        stats.errors.forEach(e => console.log(`   - ${e.folder}: ${e.error || e.file}`));
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('   DONE!');
    console.log('═══════════════════════════════════════════════════════════════\n');
}

// Run the script
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
