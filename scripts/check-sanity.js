/**
 * Sanity Studio Diagnostic Script
 * Run this to check if Sanity Studio is configured correctly
 */

console.log('🔍 Sanity Studio Diagnostic Check\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log('  NEXT_PUBLIC_SANITY_PROJECT_ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '❌ MISSING');
console.log('  NEXT_PUBLIC_SANITY_DATASET:', process.env.NEXT_PUBLIC_SANITY_DATASET || '❌ MISSING');
console.log('  SANITY_API_TOKEN:', process.env.SANITY_API_TOKEN ? '✅ SET' : '❌ MISSING');

// Expected values
console.log('\n📝 Expected Values:');
console.log('  Project ID: dsifqj4y');
console.log('  Dataset: production');
console.log('  Studio Path: /studio');

// Check if Sanity config exists
const fs = require('fs');
const path = require('path');

const configPath = path.join(process.cwd(), 'sanity', 'sanity.config.ts');
const studioPath = path.join(process.cwd(), 'src', 'app', 'studio', '[[...index]]', 'Studio.tsx');

console.log('\n📁 File Check:');
console.log('  sanity.config.ts:', fs.existsSync(configPath) ? '✅ EXISTS' : '❌ MISSING');
console.log('  Studio.tsx:', fs.existsSync(studioPath) ? '✅ EXISTS' : '❌ MISSING');

// Instructions
console.log('\n🎯 Next Steps:');
console.log('  1. Open http://localhost:3000/studio');
console.log('  2. Press F12 to open DevTools');
console.log('  3. Check Console tab for errors');
console.log('  4. If you see CORS errors, run:');
console.log('     npx sanity cors add http://localhost:3000 --credentials\n');

console.log('✅ Diagnostic check complete!\n');
