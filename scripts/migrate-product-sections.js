/**
 * Migration Script: Legacy Product Information → Product Information Tabs
 * 
 * This script migrates data from the old `detailedDescription` object format
 * to the new flexible `sections` array format.
 * 
 * Run with: node scripts/migrate-product-sections.js
 */

const sanityClient = require('@sanity/client');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Validate required environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset) {
    console.error('❌ Error: Missing Sanity configuration.');
    console.error('Please ensure NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET are set in .env.local');
    process.exit(1);
}

if (!token || token === 'your_sanity_api_token_here') {
    console.error('❌ Error: SANITY_API_TOKEN not configured.');
    console.error('\nTo get a Sanity API token:');
    console.error('1. Go to https://www.sanity.io/manage');
    console.error('2. Select your project');
    console.error('3. Navigate to API → Tokens');
    console.error('4. Create a new token with "Editor" permissions');
    console.error('5. Add it to your .env.local file as: SANITY_API_TOKEN=your_token_here\n');
    process.exit(1);
}

const client = sanityClient.createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2024-01-01',
    useCdn: false
});

async function migrateProducts() {
    console.log('🚀 Starting migration...\n');

    // Fetch all products with legacy detailedDescription
    const products = await client.fetch(`
        *[_type == "product" && defined(detailedDescription)] {
            _id,
            name,
            description,
            detailedDescription,
            sections
        }
    `);

    console.log(`Found ${products.length} products to migrate.\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const product of products) {
        try {
            console.log(`Migrating: ${product.name} (${product._id})`);

            const legacy = product.detailedDescription;
            const newSections = [];

            // 1. Product Details (from main description)
            if (product.description) {
                newSections.push({
                    _type: 'infoSection',
                    _key: `section-${Date.now()}-details`,
                    title: 'Product Details',
                    layout: 'text',
                    content: product.description
                });
            }

            // 2. Key Benefits
            if (legacy.keyBenefits && legacy.keyBenefits.length > 0) {
                newSections.push({
                    _type: 'infoSection',
                    _key: `section-${Date.now()}-benefits`,
                    title: 'Key Benefits',
                    layout: 'benefits',
                    listItems: legacy.keyBenefits
                });
            }

            // 3. Ingredients
            if (legacy.ingredients && legacy.ingredients.length > 0) {
                newSections.push({
                    _type: 'infoSection',
                    _key: `section-${Date.now()}-ingredients`,
                    title: 'Ingredients',
                    layout: 'ingredients',
                    ingredients: legacy.ingredients
                });
            }

            // 4. How to Use (combining suggestedUse and howItWorks)
            const usageContent = [];
            if (legacy.suggestedUse) {
                usageContent.push(`**Dosage Instructions:**\n${legacy.suggestedUse}`);
            }
            if (legacy.howItWorks && legacy.howItWorks.length > 0) {
                usageContent.push(`\n**How It Works:**\n${legacy.howItWorks.map((step, i) => `${i + 1}. ${step}`).join('\n')}`);
            }
            if (legacy.whoCanTakeIt && legacy.whoCanTakeIt.length > 0) {
                usageContent.push(`\n**Who Should Take This:**\n${legacy.whoCanTakeIt.map(w => `• ${w}`).join('\n')}`);
            }

            if (usageContent.length > 0) {
                newSections.push({
                    _type: 'infoSection',
                    _key: `section-${Date.now()}-usage`,
                    title: 'How to Use',
                    layout: 'usage',
                    content: usageContent.join('\n\n')
                });
            }

            // 5. Certifications
            if (legacy.cleanLabels && legacy.cleanLabels.length > 0) {
                newSections.push({
                    _type: 'infoSection',
                    _key: `section-${Date.now()}-certs`,
                    title: 'Certifications',
                    layout: 'certifications',
                    listItems: legacy.cleanLabels
                });
            }

            // Update the product
            await client
                .patch(product._id)
                .set({ sections: newSections })
                .unset(['detailedDescription']) // Remove legacy field
                .commit();

            console.log(`✅ Successfully migrated: ${product.name}\n`);
            successCount++;

        } catch (error) {
            console.error(`❌ Error migrating ${product.name}:`, error.message);
            errorCount++;
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('Migration Complete!');
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log('='.repeat(50));
}

migrateProducts()
    .then(() => {
        console.log('\n✨ All done! You can now safely remove the detailedDescription field from your schema.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Migration failed:', error);
        process.exit(1);
    });
