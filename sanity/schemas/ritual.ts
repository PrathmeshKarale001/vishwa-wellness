import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'ritual',
    title: 'Ritual',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'sanskritName',
            title: 'Sanskrit Name',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtitle',
            type: 'string',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'image',
            title: 'Main Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'benefits',
            title: 'Benefits',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'steps',
            title: 'Practice Steps',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'stepNumber', type: 'number', title: 'Step Number' },
                        { name: 'content', type: 'text', title: 'Content' }
                    ]
                }
            ],
        }),
        defineField({
            name: 'frequency',
            title: 'Frequency',
            type: 'string',
            description: 'e.g., Weekly, Daily, etc.'
        }),
        defineField({
            name: 'temperature',
            title: 'Temperature',
            type: 'string',
            description: 'e.g., Warm (37-40°C), Room temperature'
        }),
        defineField({
            name: 'products',
            title: 'Recommended Products',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'product' }] }],
        }),
        defineField({
            name: 'order',
            title: 'Display Order',
            type: 'number',
        }),
    ],
})
