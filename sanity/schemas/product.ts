import { defineType, defineField } from 'sanity';
import { SubCategorySelect } from '../components/SubCategorySelect';
import { SegmentSelect } from '../components/SegmentSelect';

export default defineType({
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'sku',
            title: 'SKU',
            type: 'string',
            description: 'Stock Keeping Unit - unique product identifier',
        }),
        defineField({
            name: 'images',
            title: 'Product Images',
            type: 'array',
            description: 'First image will be used as the main/hero image',
            of: [{ type: 'image', options: { hotspot: true } }],
        }),
        defineField({
            name: 'price',
            title: 'Price',
            type: 'number',
            validation: (Rule) => Rule.required().positive(),
        }),
        defineField({
            name: 'compareAtPrice',
            title: 'Compare at Price',
            type: 'number',
            description: 'Original price for showing discounts',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'benefitHeadline',
            title: 'Short Benefit Headline',
            type: 'string',
            description: 'One-liner marketing copy (e.g., "Supports healthy blood sugar levels naturally")'
        }),
        defineField({
            name: 'sections',
            title: 'Product Information Tabs',
            type: 'array',
            description: 'Add custom tabs like Key Benefits, Company Work, Ingredients, etc. Select a layout for each.',
            of: [
                {
                    type: 'object',
                    name: 'infoSection',
                    title: 'Information Section',
                    fields: [
                        {
                            name: 'title',
                            type: 'string',
                            title: 'Tab Title',
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'layout',
                            type: 'string',
                            title: 'Layout Style',
                            initialValue: 'text',
                            options: {
                                list: [
                                    { title: 'Standard Text', value: 'text' },
                                    { title: 'Benefits List (Checkmarks)', value: 'benefits' },
                                    { title: 'Ingredients Grid', value: 'ingredients' },
                                    { title: 'Instructions (Boxed)', value: 'usage' },
                                    { title: 'Certifications Grid', value: 'certifications' },
                                ]
                            },
                        },
                        {
                            name: 'content',
                            type: 'text',
                            title: 'Text Content',
                            hidden: ({ parent }) => parent?.layout === 'ingredients' || parent?.layout === 'benefits' || parent?.layout === 'certifications'
                        },
                        {
                            name: 'listItems',
                            type: 'array',
                            of: [{ type: 'string' }],
                            title: 'List Items',
                            hidden: ({ parent }) => parent?.layout !== 'benefits' && parent?.layout !== 'certifications'
                        },
                        {
                            name: 'ingredients',
                            type: 'array',
                            title: 'Ingredients',
                            hidden: ({ parent }) => parent?.layout !== 'ingredients',
                            of: [
                                {
                                    type: 'object',
                                    fields: [
                                        { name: 'name', type: 'string', title: 'Name' },
                                        { name: 'scientificName', type: 'string', title: 'Scientific Name' },
                                        { name: 'sanskritName', type: 'string', title: 'Sanskrit Name' },
                                        { name: 'benefits', type: 'array', of: [{ type: 'string' }], title: 'Benefits' },
                                        { name: 'description', type: 'text', title: 'Description' }
                                    ]
                                }
                            ]
                        }
                    ],
                    preview: {
                        select: { title: 'title', subtitle: 'layout' }
                    }
                }
            ]
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'reference',
            to: [{ type: 'category' }],
        }),
        defineField({
            name: 'subCategory',
            title: 'Sub-Category',
            type: 'string',
            description: 'Select a Category first to see available Sub-Categories',
            components: {
                input: SubCategorySelect
            },
            validation: (Rule) => Rule.custom((value, context) => {
                const parent: any = context.parent;
                if (parent?.category && !value) {
                    return 'Sub-Category is required when Category is selected';
                }
                return true;
            })
        }),
        defineField({
            name: 'segments',
            title: 'Segments',
            type: 'string',
            description: 'Select a Sub-Category first to see available Segments',
            components: {
                input: SegmentSelect
            },
        }),
        defineField({
            name: 'ritualType',
            title: 'Ritual Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Snān', value: 'snan' },
                    { title: 'Lepam', value: 'lepam' },
                    { title: 'Pāna', value: 'pana' },
                    { title: 'Home', value: 'home' },
                ],
            },
        }),
        defineField({
            name: 'weight',
            title: 'Weight',
            type: 'string',
        }),
        defineField({
            name: 'dimensions',
            title: 'Dimensions',
            type: 'string',
        }),
        defineField({
            name: 'inventory',
            title: 'Inventory',
            type: 'number',
            validation: (Rule) => Rule.min(0),
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags'
            }
        }),
        defineField({
            name: 'variants',
            title: 'Product Variants (Sizes/Weights)',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'variant',
                    fields: [
                        {
                            name: 'size',
                            title: 'Size/Weight',
                            type: 'string',
                            validation: (Rule) => Rule.required(),
                        },
                        { name: 'sku', title: 'SKU', type: 'string', validation: (Rule) => Rule.required() },
                        { name: 'price', title: 'Price', type: 'number', validation: (Rule) => Rule.required().positive() },
                        { name: 'inventory', title: 'Inventory', type: 'number', validation: (Rule) => Rule.min(0) },
                    ],
                },
            ],
        }),
        defineField({
            name: 'metaTitle',
            title: 'Meta Title (SEO)',
            type: 'string',
            validation: (Rule) => Rule.max(60),
        }),
        defineField({
            name: 'metaDescription',
            title: 'Meta Description (SEO)',
            type: 'text',
            rows: 3,
            validation: (Rule) => Rule.max(160),
        }),
        defineField({
            name: 'isNew',
            title: 'Is New',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'isBestSeller',
            title: 'Is Best Seller',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'isOnSale',
            title: 'Is On Sale',
            type: 'boolean',
            initialValue: false,
        }),
    ],
});
