import { defineType, defineField } from 'sanity';

export default defineType({
    name: 'diyRecipe',
    title: 'DIY Recipe',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Skin & Beauty', value: 'skin-beauty' },
                    { title: 'Health & First Aid', value: 'health-firstaid' },
                    { title: 'Home & Aura', value: 'home-aura' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'time',
            title: 'Preparation Time',
            type: 'string',
            description: 'e.g. "20 mins", "8 hours"',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'difficulty',
            title: 'Difficulty',
            type: 'string',
            options: {
                list: [
                    { title: 'Easy', value: 'Easy' },
                    { title: 'Medium', value: 'Medium' },
                    { title: 'Hard', value: 'Hard' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'ingredients',
            title: 'Ingredients',
            type: 'array',
            of: [{ type: 'string' }],
            validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
            name: 'steps',
            title: 'Steps',
            type: 'array',
            of: [{ type: 'string' }],
            validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
            name: 'benefits',
            title: 'Benefits',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'order',
            title: 'Display Order',
            type: 'number',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'category',
            media: 'image',
        },
    },
});
