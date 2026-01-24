# Sanity CMS Setup Guide for Vishwa Wellness

## Current Status
Sanity CLI is prompting for authentication. Follow the steps below:

---

## Step 1: Authenticate with Sanity

In the terminal, you're seeing:
```
? Please log in or create a new account
> Google
  GitHub  
  E-mail / password
```

**Choose your preferred method** (Google is fastest):
- Use arrow keys to select
- Press Enter to confirm
- A browser window will open for authentication
- Complete the login process

---

## Step 2: Project Configuration

After authentication, Sanity will ask several questions:

### Question 1: Project Name
```
? Project name: 
```
**Answer**: `vishwa-wellness` (or press Enter to accept default)

### Question 2: Use Default Dataset?
```
? Use default dataset configuration? (Y/n)
```
**Answer**: `Y` (press Enter)

### Question 3: Project Output Path
```
? Output path:
```
**Answer**: `./sanity` (should be pre-filled)

### Question 4: Select Project Template
```
? Select project template:
```
**Answer**: Select **"Clean project with no predefined schemas"**

---

## Step 3: After Installation Completes

Once Sanity finishes setup, you'll see:
```
✔ Success! Created Vishwa Wellness Sanity Studio
```

### Get Your Project ID

Run this command:
```bash
npx sanity manage
```

This will open your Sanity dashboard where you can find:
- **Project ID**: Copy this
- **Dataset**: Should be `production`

---

## Step 4: Update Environment Variables

1. Open `.env.local` (create if it doesn't exist)

2. Add these lines:
```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
```

---

## Step 5: Create Sanity Schemas

Navigate to the Sanity studio folder:
```bash
cd sanity
```

Create schema files in `sanity/schemas/`:

### Product Schema (`sanity/schemas/product.ts`)
```typescript
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: Rule => Rule.required().min(0)
    }),
    defineField({
      name: 'comparePrice',
      title: 'Compare Price',
      type: 'number',
      validation: Rule => Rule.min(0)
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Pāna Ritual', value: 'Pāna Ritual'},
          {title: 'Snān Ritual', value: 'Snān Ritual'},
          {title: 'Lepam Ritual', value: 'Lepam Ritual'},
          {title: 'Home & Aura', value: 'Home & Aura'},
          {title: 'Kits', value: 'Kits'},
        ]
      }
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{
        type: 'image',
        options: {
          hotspot: true,
        },
        fields: [
          {
            name: 'alt',
            type: 'string',
            title: 'Alternative Text',
          }
        ]
      }]
    }),
    defineField({
      name: 'stock',
      title: 'Stock',
      type: 'number',
      validation: Rule => Rule.required().min(0)
    }),
    defineField({
      name: 'isNew',
      title: 'New Product',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'isSale',
      title: 'On Sale',
      type: 'boolean',
      initialValue: false
    }),
  ],
})
```

### Hero Slide Schema (`sanity/schemas/heroSlide.ts`)
```typescript
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'heroSlide',
  title: 'Hero Slide',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string'
    }),
    defineField({
      name: 'highlight',
      title: 'Highlight Text',
      type: 'string'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      }
    }),
    defineField({
      name: 'cta',
      title: 'Call to Action',
      type: 'object',
      fields: [
        {name: 'text', type: 'string', title: 'Button Text'},
        {name: 'href', type: 'string', title: 'Link'}
      ]
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      validation: Rule => Rule.required()
    }),
  ],
  orderings: [
    {
      title: 'Order',
      name: 'order',
      by: [{field: 'order', direction: 'asc'}]
    }
  ]
})
```

---

## Step 6: Start Sanity Studio

```bash
cd sanity
npm run dev
```

Sanity Studio will open at `http://localhost:3333`

---

## Step 7: Add Content

1. Open Sanity Studio (`http://localhost:3333`)
2. Click "Product" to add your first product
3. Fill in the details
4. Click "Publish"

---

## Step 8: Use in Next.js

Your Next.js app is already configured! Just add products in Sanity Studio and they'll appear automatically through the fetch utilities we created.

---

## Quick Commands

```bash
# Start Sanity Studio
cd sanity && npm run dev

# Deploy Sanity Studio
cd sanity && npx sanity deploy

# Manage project settings
npx sanity manage
```

---

## Troubleshooting

**Can't see products?**
- Check `.env.local` has correct `NEXT_PUBLIC_SANITY_PROJECT_ID`
- Restart Next.js dev server: `npm run dev`

**Sanity studio not loading?**
- Run `cd sanity && npm install`
- Try `npm run dev` again

---

## Next Steps

1. Complete authentication (happening now)
2. Note your Project ID
3. Add to `.env.local`
4. Create schemas (copy from above)
5. Start adding content!

Need help? The Sanity client code is already integrated in `/src/lib/sanity.ts`!
